import { createServerFn } from "@tanstack/react-start";
import { DRIVE_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireDriveSession } from "@/lib/drive-auth";

export type DriveMedia = {
  name: string;
  path: string;
  url: string;
  type: "image" | "video";
  createdAt: string;
};

const MEDIA_TABLE = "drive_media";
const FOLDER_TABLE = "drive_folders";

function mediaType(name: string): "image" | "video" {
  return /\.(mp4|mov|webm|m4v)$/i.test(name) ? "video" : "image";
}

/**
 * Points a folder's public cover (`drive_folders.cover_url`, rendered on
 * /lunja-drive) at its current first media item. Null when the folder is
 * empty. Throws on failure so callers surface it instead of silently
 * leaving a stale cover.
 */
async function syncFolderCover(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  folder: string,
): Promise<void> {
  const { data, error: firstError } = await supabase.db
    .from(MEDIA_TABLE)
    .select("url")
    .eq("folder", folder)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(1);
  if (firstError) throw new Error(firstError.message);
  const rows = data as unknown as { url?: string }[] | null;
  const url = rows?.[0]?.url ?? null;

  const { error: updateError } = await supabase.db
    .from(FOLDER_TABLE)
    .update({ cover_url: url })
    .eq("slug", folder);
  if (updateError) throw new Error(updateError.message);
}

function isUploadedFile(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "type" in value &&
    typeof (value as { arrayBuffer: unknown }).arrayBuffer === "function"
  );
}

type DriveMediaRow = {
  name: string;
  path: string;
  url: string;
  type: "image" | "video";
  created_at: string;
};

export const listDriveMedia = createServerFn({ method: "GET" })
  .validator((folder: string) => folder)
  .handler(async ({ data: folder }): Promise<DriveMedia[]> => {
    const supabase = getSupabaseAdmin();
    const { data: rows, error } = await supabase.db
      .from(MEDIA_TABLE)
      .select("name, path, url, type, created_at")
      .eq("folder", folder)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    return (rows ?? []).map((row: DriveMediaRow) => ({
      name: row.name,
      path: row.path,
      url: row.url,
      type: row.type,
      createdAt: row.created_at,
    }));
  });

export const uploadDriveMedia = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data: formData }): Promise<DriveMedia> => {
    requireDriveSession();
    const folder = String(formData.get("folder") ?? "");
    const file = formData.get("file");
    if (!folder) throw new Error("Missing folder");
    if (!isUploadedFile(file)) throw new Error("Missing file");

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const type = mediaType(safeName);

    const supabase = getSupabaseAdmin();

    // Append new uploads at the end of the staff-defined order.
    let nextPosition = 0;
    try {
      const { data: top } = await supabase.db
        .from(MEDIA_TABLE)
        .select("position")
        .eq("folder", folder)
        .order("position", { ascending: false })
        .limit(1);
      const rows = top as unknown as { position?: number }[] | null;
      if (rows && rows.length > 0 && typeof rows[0]?.position === "number") {
        nextPosition = (rows[0]?.position ?? 0) + 1;
      }
    } catch {
      nextPosition = 0;
    }

    const { error: uploadError } = await supabase.storage
      .from(DRIVE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { data: pub } = supabase.storage.from(DRIVE_BUCKET).getPublicUrl(path);

    const { error: insertError } = await supabase.db.from(MEDIA_TABLE).insert({
      folder,
      name: safeName,
      path,
      url: pub.publicUrl,
      type,
      position: nextPosition,
    });
    if (insertError) {
      await supabase.storage.from(DRIVE_BUCKET).remove([path]);
      throw new Error(insertError.message);
    }

    // A first upload into an empty folder also becomes its public cover.
    await syncFolderCover(supabase, folder);

    return {
      name: safeName,
      path,
      url: pub.publicUrl,
      type,
      createdAt: new Date().toISOString(),
    };
  });

export const deleteDriveMedia = createServerFn({ method: "POST" })
  .validator((path: string) => path)
  .handler(async ({ data: path }): Promise<void> => {
    requireDriveSession();
    const supabase = getSupabaseAdmin();

    const { data: row } = await supabase.db
      .from(MEDIA_TABLE)
      .select("folder")
      .eq("path", path)
      .maybeSingle();
    const folder = (row as unknown as { folder?: string } | null)?.folder ?? null;

    const { error: storageError } = await supabase.storage.from(DRIVE_BUCKET).remove([path]);
    if (storageError) throw new Error(storageError.message);

    const { error: deleteError } = await supabase.db.from(MEDIA_TABLE).delete().eq("path", path);
    if (deleteError) throw new Error(deleteError.message);

    // If the removed item was the cover, promote the new first item.
    if (folder) await syncFolderCover(supabase, folder);
  });

const MAX_REORDER_ITEMS = 500;

/**
 * Staff-only persist of a folder's custom media order.
 * `paths` is the full ordered list of storage paths (first = position 1).
 * Rows are scoped to `folder` so one folder can never rewrite another's order.
 */
export const reorderDriveMedia = createServerFn({ method: "POST" })
  .validator((data: { folder: string; paths: string[] }) => data)
  .handler(async ({ data: { folder, paths } }): Promise<void> => {
    requireDriveSession();
    if (!folder) throw new Error("Missing folder");
    if (!Array.isArray(paths) || paths.length === 0) throw new Error("Missing order");
    if (paths.length > MAX_REORDER_ITEMS) throw new Error("Too many items");
    const seen = new Set<string>();
    for (const p of paths) {
      if (typeof p !== "string" || !p || seen.has(p)) throw new Error("Invalid order");
      seen.add(p);
    }
    const supabase = getSupabaseAdmin();

    // Guard against stale clients: the submitted order must cover exactly
    // the folder's current rows, otherwise positions could collide.
    const { data: existing, error: existingError } = await supabase.db
      .from(MEDIA_TABLE)
      .select("path")
      .eq("folder", folder);
    if (existingError) throw new Error(existingError.message);
    const existingPaths = new Set(
      ((existing as unknown as { path: string }[] | null) ?? []).map((r) => r.path),
    );
    if (existingPaths.size !== paths.length || paths.some((p) => !existingPaths.has(p))) {
      throw new Error("La liste a changé, veuillez rafraîchir puis réessayer.");
    }

    for (let i = 0; i < paths.length; i++) {
      const { error } = await supabase.db
        .from(MEDIA_TABLE)
        .update({ position: i + 1 })
        .eq("folder", folder)
        .eq("path", paths[i]);
      if (error) throw new Error(error.message);
    }

    // The new first item becomes the folder's public cover on /lunja-drive.
    await syncFolderCover(supabase, folder);
  });

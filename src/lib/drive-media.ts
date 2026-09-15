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

function mediaType(name: string): "image" | "video" {
  return /\.(mp4|mov|webm|m4v)$/i.test(name) ? "video" : "image";
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
    });
    if (insertError) {
      await supabase.storage.from(DRIVE_BUCKET).remove([path]);
      throw new Error(insertError.message);
    }

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

    const { error: storageError } = await supabase.storage.from(DRIVE_BUCKET).remove([path]);
    if (storageError) throw new Error(storageError.message);

    const { error: deleteError } = await supabase.db.from(MEDIA_TABLE).delete().eq("path", path);
    if (deleteError) throw new Error(deleteError.message);
  });

import { createServerFn } from "@tanstack/react-start";
import { DRIVE_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";

export type FolderDef = {
  slug: string;
  name: string;
  cover: string | null;
  tint: string;
};

const FOLDER_TABLE = "drive_folders";
const MEDIA_TABLE = "drive_media";
const TINTS = ["bg-[#C8E420]", "bg-[#FFE600]", "bg-[#FFF7D6]"];

type FolderRow = {
  slug: string;
  name: string;
  cover_url: string | null;
};

function tintFor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
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

export const listFolders = createServerFn({ method: "GET" }).handler(async (): Promise<FolderDef[]> => {
  const supabase = getSupabaseAdmin();
  const { data: rows, error } = await supabase.db
    .from(FOLDER_TABLE)
    .select("slug, name, cover_url")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  return (rows ?? []).map((row: FolderRow) => ({
    slug: row.slug,
    name: row.name,
    cover: row.cover_url,
    tint: tintFor(row.slug),
  }));
});

export const createFolder = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data: formData }): Promise<FolderDef> => {
    const name = String(formData.get("name") ?? "").trim();
    if (!name) throw new Error("Missing folder name");

    const baseSlug = slugify(name) || `dossier-${Date.now()}`;
    const supabase = getSupabaseAdmin();

    let slug = baseSlug;
    const { data: existing } = await supabase.db.from(FOLDER_TABLE).select("slug").eq("slug", slug).maybeSingle();
    if (existing) slug = `${baseSlug}-${Date.now().toString(36)}`;

    let coverUrl: string | null = null;
    const coverFile = formData.get("cover");
    if (isUploadedFile(coverFile) && coverFile.size > 0) {
      const safeName = coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const coverPath = `_covers/${slug}-${Date.now()}-${safeName}`;
      const { error: coverError } = await supabase.storage
        .from(DRIVE_BUCKET)
        .upload(coverPath, coverFile, { contentType: coverFile.type, upsert: false });
      if (coverError) throw new Error(coverError.message);
      coverUrl = supabase.storage.from(DRIVE_BUCKET).getPublicUrl(coverPath).data.publicUrl;
    }

    const { error: insertError } = await supabase.db.from(FOLDER_TABLE).insert({ slug, name, cover_url: coverUrl });
    if (insertError) throw new Error(insertError.message);

    return { slug, name, cover: coverUrl, tint: tintFor(slug) };
  });

export const renameFolder = createServerFn({ method: "POST" })
  .validator((data: { slug: string; name: string }) => data)
  .handler(async ({ data: { slug, name } }): Promise<void> => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Missing folder name");
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.db.from(FOLDER_TABLE).update({ name: trimmed }).eq("slug", slug);
    if (error) throw new Error(error.message);
  });

export const deleteFolder = createServerFn({ method: "POST" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<void> => {
    const supabase = getSupabaseAdmin();

    const { data: mediaRows, error: mediaError } = await supabase.db
      .from(MEDIA_TABLE)
      .select("path")
      .eq("folder", slug);
    if (mediaError) throw new Error(mediaError.message);

    const paths = (mediaRows ?? []).map((row: { path: string }) => row.path);
    if (paths.length > 0) {
      await supabase.storage.from(DRIVE_BUCKET).remove(paths);
    }

    const { error: deleteMediaError } = await supabase.db.from(MEDIA_TABLE).delete().eq("folder", slug);
    if (deleteMediaError) throw new Error(deleteMediaError.message);

    const { error: deleteFolderError } = await supabase.db.from(FOLDER_TABLE).delete().eq("slug", slug);
    if (deleteFolderError) throw new Error(deleteFolderError.message);
  });

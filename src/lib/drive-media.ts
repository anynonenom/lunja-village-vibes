import { createServerFn } from "@tanstack/react-start";
import { DRIVE_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";

export type DriveMedia = {
  name: string;
  path: string;
  url: string;
  type: "image" | "video";
  createdAt: string;
};

function mediaType(name: string): "image" | "video" {
  return /\.(mp4|mov|webm|m4v)$/i.test(name) ? "video" : "image";
}

export const listDriveMedia = createServerFn({ method: "GET" })
  .validator((folder: string) => folder)
  .handler(async ({ data: folder }): Promise<DriveMedia[]> => {
    const supabase = getSupabaseAdmin();
    const { data: files, error } = await supabase.storage
      .from(DRIVE_BUCKET)
      .list(folder, { sortBy: { column: "created_at", order: "desc" } });
    if (error) throw error;

    return (files ?? [])
      .filter((file) => file.id && file.name !== ".emptyFolderPlaceholder")
      .map((file) => {
        const path = `${folder}/${file.name}`;
        const { data: pub } = supabase.storage.from(DRIVE_BUCKET).getPublicUrl(path);
        return {
          name: file.name,
          path,
          url: pub.publicUrl,
          type: mediaType(file.name),
          createdAt: file.created_at ?? new Date().toISOString(),
        };
      });
  });

export const uploadDriveMedia = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data: formData }): Promise<DriveMedia> => {
    const folder = String(formData.get("folder") ?? "");
    const file = formData.get("file");
    if (!folder) throw new Error("Missing folder");
    if (!(file instanceof File)) throw new Error("Missing file");

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${folder}/${Date.now()}-${safeName}`;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage
      .from(DRIVE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;

    const { data: pub } = supabase.storage.from(DRIVE_BUCKET).getPublicUrl(path);
    return {
      name: safeName,
      path,
      url: pub.publicUrl,
      type: mediaType(safeName),
      createdAt: new Date().toISOString(),
    };
  });

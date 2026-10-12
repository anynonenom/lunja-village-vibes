import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { DRIVE_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";
import { requireDriveSession } from "@/lib/drive-auth";

/**
 * Persistent restaurant/bar cover image for the public landing page.
 *
 * - Storage: same `lunja-drive` bucket, dedicated `site-covers/` prefix.
 * - Metadata: `site_settings` table, row `key = 'restaurant_cover'`.
 * - Public page (`ChilloutSection` in `src/routes/index.tsx`) reads via
 *   `getLandingCover()` and falls back to the local `ph-drinks.jpg` asset
 *   until a genuine photo is uploaded.
 */

export const RESTAURANT_COVER_KEY = "restaurant_cover";
const SETTINGS_TABLE = "site_settings";
const COVER_PREFIX = "site-covers";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp"] as const;

export type LandingCover = {
  /** Public URL of the custom cover, or null when none saved yet. */
  url: string | null;
  /** ISO timestamp of the last save, used for cache-busting. */
  updatedAt: string | null;
};

type SettingsRow = {
  url: string;
  path: string;
  updated_at: string;
};

function isUploadedFile(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "name" in value &&
    "type" in value &&
    "size" in value &&
    typeof (value as { arrayBuffer: unknown }).arrayBuffer === "function"
  );
}

function extOf(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? (parts[parts.length - 1] ?? "") : "";
}

/** Append a cache-buster so browsers/CDN fetch the fresh image after a save. */
export function withCacheBuster(url: string, updatedAt: string | null): string {
  if (!updatedAt) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${encodeURIComponent(updatedAt)}`;
}

/**
 * Public read — no auth required. Returns `{url:null}` when no custom
 * cover has been saved yet or when the settings table is missing
 * (fresh project before migration), so callers can render the fallback.
 */
export const getLandingCover = createServerFn({ method: "GET" }).handler(
  async (): Promise<LandingCover> => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.db
        .from(SETTINGS_TABLE)
        .select("url, updated_at")
        .eq("key", RESTAURANT_COVER_KEY)
        .maybeSingle();
      if (error) {
        // Missing table before migration (42P01) or no row: fall back quietly.
        console.error(`[landing-cover] read failed: ${error.message}`);
        return { url: null, updatedAt: null };
      }
      const row = data as unknown as Pick<SettingsRow, "url" | "updated_at"> | null;
      if (!row?.url) return { url: null, updatedAt: null };
      return { url: row.url, updatedAt: row.updated_at ?? null };
    } catch (error) {
      console.error("[landing-cover] read failed:", error);
      return { url: null, updatedAt: null };
    }
  },
);

/**
 * Staff-only replace. Requires a valid drive session cookie.
 * Uploads first, persists the new reference only on success, and never
 * deletes the previous image before the replacement is safely stored.
 */
export const updateLandingCover = createServerFn({ method: "POST" })
  .validator((formData: FormData) => formData)
  .handler(async ({ data: formData }): Promise<LandingCover> => {
    requireDriveSession();

    const file = formData.get("file");
    if (!isUploadedFile(file) || file.size <= 0) {
      throw new Error("Aucun fichier image reçu.");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Image trop lourde (5 Mo maximum).");
    }
    const ext = extOf(file.name);
    if (
      !(ALLOWED_MIME as readonly string[]).includes(file.type) ||
      !(ALLOWED_EXT as readonly string[]).includes(ext)
    ) {
      throw new Error("Format non pris en charge (JPEG, PNG ou WebP uniquement).");
    }

    const supabase = getSupabaseAdmin();

    // Remember the previous path so we can clean it up after a success.
    let previousPath: string | null = null;
    try {
      const { data: prev } = await supabase.db
        .from(SETTINGS_TABLE)
        .select("path")
        .eq("key", RESTAURANT_COVER_KEY)
        .maybeSingle();
      previousPath = (prev as unknown as { path?: string } | null)?.path ?? null;
    } catch {
      previousPath = null;
    }

    const safeBase = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-80) || "cover";
    const rand = Math.random().toString(36).slice(2, 8);
    const path = `${COVER_PREFIX}/restaurant-${Date.now()}-${rand}-${safeBase}`;

    const { error: uploadError } = await supabase.storage
      .from(DRIVE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new Error(`Échec de l'envoi : ${uploadError.message}`);

    const { data: pub } = supabase.storage.from(DRIVE_BUCKET).getPublicUrl(path);
    const url = pub.publicUrl;
    const updatedAt = new Date().toISOString();

    const { error: upsertError } = await supabase.db
      .from(SETTINGS_TABLE)
      .upsert(
        { key: RESTAURANT_COVER_KEY, url, path, updated_at: updatedAt },
        { onConflict: "key" },
      );
    if (upsertError) {
      // Roll back the just-uploaded file; keep the previous published image.
      await supabase.storage.from(DRIVE_BUCKET).remove([path]);
      throw new Error(`Échec de l'enregistrement : ${upsertError.message}`);
    }

    // Best-effort cleanup of the superseded file (never blocks success).
    if (previousPath && previousPath !== path && previousPath.startsWith(COVER_PREFIX)) {
      try {
        await supabase.storage.from(DRIVE_BUCKET).remove([previousPath]);
      } catch (error) {
        console.error("[landing-cover] cleanup of previous cover failed:", error);
      }
    }

    return { url, updatedAt };
  });

/**
 * Client hook: resolves the live cover URL with cache-busting,
 * falling back to the bundled local asset on any failure.
 */
export function useLandingCover(fallbackSrc: string): {
  src: string;
  isCustom: boolean;
  loading: boolean;
} {
  const [cover, setCover] = useState<LandingCover | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLandingCover()
      .then((result) => {
        if (!cancelled) setCover(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed || (cover && !cover.url)) return { src: fallbackSrc, isCustom: false, loading: false };
  if (!cover) return { src: fallbackSrc, isCustom: false, loading: true };
  return {
    src: cover.url ? withCacheBuster(cover.url, cover.updatedAt) : fallbackSrc,
    isCustom: Boolean(cover.url),
    loading: false,
  };
}

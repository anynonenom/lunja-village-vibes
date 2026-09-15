import { PostgrestClient } from "@supabase/postgrest-js";
import { StorageClient } from "@supabase/storage-js";

export const DRIVE_BUCKET = "lunja-drive";

function getCredentials() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase admin credentials are not configured on the server.");
  }
  return { url, key };
}

const authHeaders = (key: string) => ({
  apikey: key,
  Authorization: `Bearer ${key}`,
});

// Uses the lightweight postgrest-js / storage-js clients directly instead of
// the full @supabase/supabase-js, which eagerly constructs a RealtimeClient
// on every instantiation and throws when the server runtime has no native
// WebSocket (e.g. Node < 22 without a ws polyfill).
export function getSupabaseAdmin() {
  const { url, key } = getCredentials();
  const headers = authHeaders(key);

  return {
    db: new PostgrestClient(`${url}/rest/v1`, { headers }),
    storage: new StorageClient(`${url}/storage/v1`, headers),
  };
}

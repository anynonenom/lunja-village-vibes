/**
 * Site-wide soft launch lock.
 *
 * While LOCKED (the default):
 *   - every route except `/map-lunja` redirects to `/map-lunja`
 *   - the top nav shows no links and no "Book your stay"
 *   - the footer hides its page links, the Chillout links and the booking CTA
 *   - the "Enter CHILLOUT" button on /map-lunja is hidden
 *
 * To OPEN the whole site later — no code change needed:
 *   add an env var in Vercel → Project → Settings → Environment Variables
 *     VITE_SITE_LOCKED = false
 *   then redeploy. Delete the var (or set it back to `true`) to lock again.
 *
 * Or, for a permanent change, flip DEFAULT_LOCKED below and push.
 */
const DEFAULT_LOCKED = true;

const flag = import.meta.env.VITE_SITE_LOCKED as string | undefined;

export const SITE_LOCKED =
  flag == null || flag === "" ? DEFAULT_LOCKED : flag.toLowerCase() !== "false";

/** The only page reachable while the site is locked. */
export const PUBLIC_ROUTE = "/map-lunja";

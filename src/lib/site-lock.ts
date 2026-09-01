/**
 * Site-wide soft launch lock.
 *
 * While LOCKED (the default) every route redirects to the approved
 * landing page (`/map-lunja-2`). The older `/map-lunja` version is
 * blocked along with the rest of the site.
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

/** The only page reachable while the site is locked (the approved version). */
export const PUBLIC_ROUTES = ["/map-lunja-2"] as const;

/** Where locked traffic lands. */
export const PUBLIC_ROUTE = PUBLIC_ROUTES[0];

export function isPublicRoute(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, "") || "/";
  return (PUBLIC_ROUTES as readonly string[]).includes(p);
}

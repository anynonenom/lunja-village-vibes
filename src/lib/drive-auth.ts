import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "lunja_drive_session";
const MAX_AGE = 60 * 60 * 24 * 14; // 14 days
const PAYLOAD = "authenticated";

function getSigningSecret(): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Missing server secret for Drive auth.");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSigningSecret()).update(value).digest("hex");
}

function makeToken(): string {
  return `${PAYLOAD}.${sign(PAYLOAD)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (payload !== PAYLOAD || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Throws if the request doesn't carry a valid Drive session cookie. Call at the top of every mutating server function. */
export const requireDriveSession = createServerOnlyFn((): void => {
  const token = getCookie(COOKIE_NAME);
  if (!isValidToken(token)) {
    throw new Error("Authentification requise.");
  }
});

export const driveLogin = createServerFn({ method: "POST" })
  .validator((password: string) => password)
  .handler(async ({ data: password }) => {
    const expected = process.env.DRIVE_UPLOAD_PASSWORD;
    if (!expected) throw new Error("Mot de passe non configuré côté serveur.");
    if (password !== expected) throw new Error("Mot de passe incorrect.");

    setCookie(COOKIE_NAME, makeToken(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE,
    });
    return { ok: true as const };
  });

export const driveLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE_NAME, { path: "/" });
});

export const checkDriveSession = createServerFn({ method: "GET" }).handler(async (): Promise<{ authenticated: boolean }> => {
  return { authenticated: isValidToken(getCookie(COOKIE_NAME)) };
});

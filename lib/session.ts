import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload } from "@/types";

const SECRET_KEY = process.env.AUTH_SECRET!;
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(
  payload: Omit<SessionPayload, keyof JWTPayload>
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Session expires in 1 hour
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createAdminSession(email: string): Promise<void> {
  const session = await encrypt({
    email,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Store as ISO string
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 60 * 60 * 1000),
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

export async function validateAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session) return false;

  try {
    const payload = await decrypt(session.value);
    if (!payload) return false;

    // Check if session is expired
    if (new Date(payload.expiresAt) < new Date()) {
      await clearAdminSession();
      return false;
    }

    return true;
  } catch (error) {
    await clearAdminSession();
    return false;
  }
}

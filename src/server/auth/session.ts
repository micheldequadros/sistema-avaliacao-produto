import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

// Sessão stateless: JWT HS256 num cookie httpOnly. O payload leva só `sub`
// (id da conta) e `exp`; nome e email vêm do banco (ver current-account.ts).

export type Session = { accountId: string };

const COOKIE_NAME = "session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias
const ALGORITHM = "HS256";

let encodedKey: Uint8Array | undefined;

function getKey(): Uint8Array {
  if (encodedKey) return encodedKey;
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET precisa estar definida com 32+ caracteres (veja .env.example).",
    );
  }
  encodedKey = new TextEncoder().encode(secret);
  return encodedKey;
}

/** Cria o cookie de sessão para a conta. */
export async function createSession(accountId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(accountId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getKey());

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Remove o cookie de sessão. */
export async function deleteSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

/** Sessão atual, ou `null` se ausente, inválida ou expirada. */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: [ALGORITHM],
    });
    return payload.sub ? { accountId: payload.sub } : null;
  } catch {
    // Assinatura inválida, token malformado ou expirado.
    return null;
  }
}

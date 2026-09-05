import crypto from "crypto";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 días

interface SessionPayload {
  usuarioId: number;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.RAYONGRID_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Falta la variable RAYONGRID_SESSION_SECRET en .env.local"
    );
  }

  return secret;
}

function createSignature(payload: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

export function crearSesion(usuarioId: number): string {
  const payload: SessionPayload = {
    usuarioId,
    exp:
      Math.floor(Date.now() / 1000) +
      SESSION_DURATION_SECONDS,
  };

  const payloadEncoded = Buffer.from(
    JSON.stringify(payload)
  ).toString("base64url");

  const signature = createSignature(payloadEncoded);

  return `${payloadEncoded}.${signature}`;
}

export function verificarSesion(
  token: string | undefined
): SessionPayload | null {
  if (!token) {
    return null;
  }

  try {
    const [payloadEncoded, signature] = token.split(".");

    if (!payloadEncoded || !signature) {
      return null;
    }

    const expectedSignature = createSignature(payloadEncoded);

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(
        signatureBuffer,
        expectedBuffer
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(payloadEncoded, "base64url").toString("utf8")
    ) as SessionPayload;

    if (
      typeof payload.usuarioId !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
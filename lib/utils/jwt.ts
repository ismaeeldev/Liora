const encoder = new TextEncoder();
const decoder = new TextDecoder();

function arrayBufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlToArrayBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), "=");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const headerBase64 = arrayBufferToBase64Url(encoder.encode(JSON.stringify(header)));
  const payloadBase64 = arrayBufferToBase64Url(encoder.encode(JSON.stringify(payload)));

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${headerBase64}.${payloadBase64}`)
  );
  const signatureBase64 = arrayBufferToBase64Url(signatureBuffer);

  return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
}

export async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerBase64, payloadBase64, signatureBase64] = parts;
    const key = await getCryptoKey(secret);
    const data = encoder.encode(`${headerBase64}.${payloadBase64}`);
    const signature = base64UrlToArrayBuffer(signatureBase64);

    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);

    if (!isValid) return null;

    const payloadJson = decoder.decode(base64UrlToArrayBuffer(payloadBase64));
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

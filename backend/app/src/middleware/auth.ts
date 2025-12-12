// middleware/auth.ts
import { createMiddleware } from "hono/factory";
import { verify, decode } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { Context, Next } from "hono";

const AUTH0_DOMAIN = Deno.env.get("AUTH0_DOMAIN")!;
const AUTH0_AUDIENCE = Deno.env.get("AUTH0_AUDIENCE")!;

// Cache for JWKS
let jwksCache: any = null;
let jwksCacheTime = 0;
const JWKS_CACHE_TTL = 3600000; // 1 hour

async function getJwks() {
  const now = Date.now();
  if (jwksCache && now - jwksCacheTime < JWKS_CACHE_TTL) {
    return jwksCache;
  }

  const response = await fetch(`https://${AUTH0_DOMAIN}/.well-known/jwks.json`);
  jwksCache = await response.json();
  jwksCacheTime = now;
  return jwksCache;
}

async function getSigningKey(kid: string) {
  const jwks = await getJwks();
  const key = jwks.keys.find((k: any) => k.kid === kid);
  if (!key) {
    throw new Error("Signing key not found");
  }
  return key;
}

export const requiresAuth = createMiddleware(async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTPException(401, {
      message: "Missing or invalid Authorization header",
    });
  }

  const token = authHeader.substring(7);

  try {
    // Decode to get the key ID
    const decoded = decode(token);
    const kid = decoded.header.kid;

    // Get the signing key from Auth0
    const signingKey = await getSigningKey(kid);

    // Import the JWK and verify
    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      signingKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Verify the token
    const payload = await verify(token, cryptoKey, "RS256");

    // Validate claims
    if (payload.iss !== `https://${AUTH0_DOMAIN}/`) {
      throw new Error("Invalid issuer");
    }

    if (
      payload.aud !== AUTH0_AUDIENCE &&
      !(Array.isArray(payload.aud) && payload.aud.includes(AUTH0_AUDIENCE))
    ) {
      throw new Error("Invalid audience");
    }

    // Add user info to context
    c.set("user", payload);
    c.set("userId", payload.sub);

    await next();
  } catch (error) {
    console.error("Auth error:", error);
    throw new HTTPException(401, { message: "Invalid token" });
  }
});

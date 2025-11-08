import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { SignJWT, importJWK } from "jose";
import { db } from "./db";
import * as schema from "./schema";

// Load the private key and kid from SUPABASE_SIGNING_KEY environment variable
const getPrivateKey = async () => {
  const encodedSigningKey = process.env.SUPABASE_SIGNING_KEY;

  if (!encodedSigningKey) {
    throw new Error("SUPABASE_SIGNING_KEY environment variable is required");
  }

  // Decode base64 and parse JSON
  const signingKeyJson = Buffer.from(encodedSigningKey, "base64").toString(
    "utf-8"
  );
  const signingKeys = JSON.parse(signingKeyJson);

  if (!Array.isArray(signingKeys) || signingKeys.length === 0) {
    throw new Error(
      "SUPABASE_SIGNING_KEY must contain a base64-encoded JSON array with at least one key"
    );
  }

  const signingKey = signingKeys[0];
  const kid = signingKey.kid;

  if (!kid) {
    throw new Error("Signing key must contain a 'kid' field");
  }

  const privateKey = await importJWK(signingKey, "ES256");

  return { privateKey, kid };
};

const supabaseApi = process.env.SUPABASE_API || "http://127.0.0.1:54342";

export const auth = betterAuth<BetterAuthOptions>({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //     scope: ["email", "profile"],
  //   },
  // },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    database: {
      generateId: false,
    },
  },
  plugins: [
    jwt({
      jwks: {
        remoteUrl: `${supabaseApi}/auth/v1/.well-known/jwks.json`,
        keyPairConfig: {
          alg: "ES256",
        },
      },
      jwt: {
        definePayload: ({ user, session }) => {
          return {
            // Required claims
            sub: user.id, // Subject (user ID)
            role: "authenticated",
            aal: "aal1", // Authenticator Assurance Level (aal1 = single-factor, aal2 = multi-factor)
            session_id: session.id,
            email: user.email || "",
            phone: "", // Phone not in schema, empty string
            is_anonymous: false,

            // Optional claims
            app_metadata: {
              provider: "email",
              providers: ["email"],
            },
            user_metadata: {
              ...(user.name && { name: user.name }),
              ...(user.image && { image: user.image }),
            },
            amr: [
              {
                method: "password",
                timestamp: session.expiresAt,
              },
            ],
          };
        },
        sign: async (jwtPayload) => {
          const { privateKey, kid } = await getPrivateKey();
          const issuer = `${supabaseApi}/auth/v1`;

          return await new SignJWT(jwtPayload)
            .setProtectedHeader({
              alg: "ES256",
              kid: kid,
              typ: "JWT",
            })
            .setIssuedAt()
            .setIssuer(issuer)
            .setAudience("authenticated") // Supabase uses "authenticated" or "anon" for audience
            .setExpirationTime("15m")
            .sign(privateKey);
        },
      },
    }),
  ],
});

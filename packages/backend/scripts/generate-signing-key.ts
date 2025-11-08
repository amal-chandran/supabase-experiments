import { randomUUID } from "crypto";
import { writeFileSync } from "fs";
import { exportJWK, generateKeyPair } from "jose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const projectRoot = join(__dirname, "..");
const signingKeyPath = join(projectRoot, "supabase", "signing_key.json");
const signingKeyBasePath = join(projectRoot, "supabase", "signing_key.base");

interface SigningKey {
  kty: string;
  kid: string;
  use: string;
  key_ops: string[];
  alg: string;
  ext: boolean;
  d?: string;
  crv: string;
  x: string;
  y: string;
}

async function generateSigningKey(): Promise<void> {
  console.log("🔑 Generating signing key using jose...");

  try {
    // Generate ES256 key pair
    const { publicKey, privateKey } = await generateKeyPair("ES256");

    // Export both keys as JWK
    const publicJWK = await exportJWK(publicKey);
    const privateJWK = await exportJWK(privateKey);

    // Generate a unique key ID
    const kid = randomUUID();

    // Format the signing key in the expected format
    const signingKey: SigningKey = {
      kty: "EC",
      kid,
      use: "sig",
      key_ops: ["sign", "verify"],
      alg: "ES256",
      ext: true,
      d: privateJWK.d, // Private key component
      crv: "P-256",
      x: publicJWK.x!, // Public key x coordinate
      y: publicJWK.y!, // Public key y coordinate
    };

    // Wrap in array format as expected by the code
    const keyArray = [signingKey];

    // Save to signing_key.json
    writeFileSync(signingKeyPath, JSON.stringify(keyArray, null, 4), "utf-8");
    console.log(`✅ Saved signing key to: ${signingKeyPath}`);

    // Base64 encode the JSON array
    const jsonString = JSON.stringify(keyArray);
    const encodedKey = Buffer.from(jsonString).toString("base64");
    console.log("✅ Encoded signing key to base64");

    // Create or update signing_key.base file
    writeFileSync(signingKeyBasePath, encodedKey, "utf-8");
    console.log(`✅ Saved base64 encoded signing key to: ${signingKeyBasePath}`);

    console.log("\n✨ Done! Signing key generated and encoded successfully.");
  } catch (error) {
    console.error(
      "❌ Error generating signing key:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Run the script
generateSigningKey();


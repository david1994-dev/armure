import "dotenv/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { extname, join, basename } from "node:path";
import { readdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff"]);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name} (see .env.example)`);
  }
  return value;
}

async function main() {
  const [inputDir, rawPrefix] = process.argv.slice(2);
  if (!inputDir) {
    console.error("Usage: pnpm upload:images <inputDir> [remotePrefix]");
    console.error('Example: pnpm upload:images ./incoming/oversized-tee products/oversized-tee');
    process.exit(1);
  }
  const prefix = rawPrefix ? `${rawPrefix.replace(/^\/+|\/+$/g, "")}/` : "";

  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET_NAME");
  const publicUrl = requireEnv("R2_PUBLIC_URL").replace(/\/+$/, "");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const entries = await readdir(inputDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();

  if (files.length === 0) {
    console.error(`No images found in ${inputDir}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} image(s). Resizing to max width ${MAX_WIDTH}px, converting to WebP q${WEBP_QUALITY}...\n`);

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const inputPath = join(inputDir, file);
    const original = await readFile(inputPath);

    const outputBuffer = await sharp(original)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const key = `${prefix}${basename(file, extname(file))}.webp`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: outputBuffer,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const originalKb = (original.byteLength / 1024).toFixed(0);
    const outputKb = (outputBuffer.byteLength / 1024).toFixed(0);
    const url = `${publicUrl}/${key}`;
    uploadedUrls.push(url);
    console.log(`✓ ${file}  ${originalKb}KB → ${outputKb}KB  ${url}`);
  }

  console.log(`\nDone. ${uploadedUrls.length} image(s) uploaded to bucket "${bucket}".`);
  console.log("\nURLs to paste into lib/data/products.ts:");
  for (const url of uploadedUrls) console.log(url);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

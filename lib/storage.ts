import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let client: S3Client | undefined;

function config() {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) throw new Error("S3 is not configured");
  client ??= new S3Client({ endpoint, region, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } });
  return { client, bucket };
}

export async function putObject(key: string, bytes: Uint8Array, contentType: string) {
  const { client: s3, bucket } = config();
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }));
}

export async function getObject(key: string) {
  const { client: s3, bucket } = config();
  return s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
}

export async function deleteObject(key: string) {
  const { client: s3, bucket } = config();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

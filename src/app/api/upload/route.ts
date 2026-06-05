import { writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/api";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("multipart/form-data")) return fail("Must be multipart/form-data", 400);
  const formData = await req.formData().catch(() => null);
  if (!formData) return fail("Invalid form data", 400);
  const file = formData.get("file") as File | null;

  if (!file) return fail("No file provided", 400);
  if (!ALLOWED_TYPES.includes(file.type)) return fail("Only JPEG, PNG, WebP, GIF allowed", 400);
  if (file.size > MAX_BYTES) return fail("File too large (max 5 MB)", 400);

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const dest = join(process.cwd(), "public", "uploads", filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(dest, buffer);

  return ok({ url: `/uploads/${filename}` });
}

import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

export async function uploadFile(file: File, folder: string = "uploads") {
  // If the Vercel Blob Read/Write token is missing, fall back to local disk storage
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save locally under public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate a unique filename
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      await fs.promises.writeFile(filePath, buffer);
      return { url: `/uploads/${uniqueFilename}` };
    } catch (err: any) {
      console.error("Local file system upload fallback failed:", err);
      throw new Error(`Local upload failed: ${err.message || err}`);
    }
  }

  // Upload to Vercel Blob if token is available
  const blob = await put(`${folder}/${file.name}`, file, {
    access: "public",
  });
  return blob;
}

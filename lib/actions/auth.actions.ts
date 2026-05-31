"use server";

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/utils/jwt";
import { cookies } from "next/headers";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-safe-admin-jwt-secret-key-10220";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function adminLogin(formData: z.infer<typeof LoginSchema>) {
  try {
    const validatedData = LoginSchema.parse(formData);

    const admin = await prisma.adminUser.findUnique({
      where: { email: validatedData.email },
    });

    if (!admin) {
      return { success: false, error: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(validatedData.password, admin.password);
    if (!isMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    // Generate JWT Session Token (expires in 24 hours)
    const token = await signJWT(
      {
        sub: admin.id,
        email: admin.email,
        role: admin.role,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
      JWT_SECRET
    );

    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return { success: true, role: admin.role };
  } catch (error: unknown) {
    console.error("Login server action error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Something went wrong during login" };
  }
}

export async function adminLogout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
  } catch (error: unknown) {
    console.error("Logout server action error:", error);
    return { success: false, error: "Failed to log out" };
  }
}

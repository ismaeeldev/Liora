import nodemailer from "nodemailer";

// Environment validation
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

const isDevelopment = process.env.NODE_ENV !== "production";

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  if (!isDevelopment) {
    console.warn("SMTP credentials are missing in production. Email features will fail.");
  }
}

// Create a reusable transporter
export const transporter = nodemailer.createTransport({
  host: SMTP_HOST || "smtp.gmail.com",
  port: parseInt(SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

/**
 * Core send mail wrapper providing unified error handling
 */
export async function sendMail(options: SendMailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const defaultFrom = SMTP_FROM || '"Aldora Platform" <noreply@aldora.com>';
    
    const info = await transporter.sendMail({
      from: defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    console.error("Failed to send email:", error instanceof Error ? error.message : error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
  }
}

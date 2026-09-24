"use server";

import { headers } from "next/headers";

export interface ContactState {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
}

const SUBJECTS = ["General question", "Tour recommendation", "Partnership", "Report an issue", "Other"];
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

// Best-effort in-memory rate limit per instance: 5 submissions per 10 minutes per IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);

async function deliver(payload: { name: string; email: string; subject: string; message: string }) {
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (resendKey && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "ThingsToDoOrlando.com <contact@thingstodoorlando.com>",
        to: [to],
        reply_to: payload.email,
        subject: `[Contact] ${payload.subject}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\n${payload.message}`,
      }),
      cache: "no-store",
    });
    return res.ok;
  }
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook && webhook.startsWith("https://")) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return res.ok;
  }
  console.error("[contact] No delivery method configured (RESEND_API_KEY + CONTACT_TO_EMAIL or CONTACT_WEBHOOK_URL).");
  return false;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot and minimum fill time catch most bots silently.
  const started = Number(formData.get("ts"));
  if (clean(formData.get("website"), 200) || !started || Date.now() - started < 2500) {
    return { status: "success", message: "Thanks! Your message has been sent." };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many messages. Please try again in a few minutes." };
  }

  const data = {
    name: clean(formData.get("name"), 100),
    email: clean(formData.get("email"), 200),
    subject: clean(formData.get("subject"), 60),
    message: clean(formData.get("message"), 5000),
  };
  const errors: ContactState["errors"] = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  if (!SUBJECTS.includes(data.subject)) errors.subject = "Please choose a topic.";
  if (data.message.length < 10) errors.message = "Please enter a message of at least 10 characters.";
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  const ok = await deliver(data).catch(() => false);
  return ok
    ? { status: "success", message: "Thanks! Your message has been sent. We reply within two business days." }
    : { status: "error", message: "Sorry, we could not send your message right now. Please try again later." };
}

"use client";

import { useActionState, useState } from "react";
import { submitContact, type ContactState } from "./actions";

const initial: ContactState = { status: "idle", message: "" };
const SUBJECTS = ["General question", "Tour recommendation", "Partnership", "Report an issue", "Other"];

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [ts] = useState(() => Date.now());

  if (state.status === "success") {
    return (
      <div className="notice is-success" role="status">
        {state.message}
      </div>
    );
  }

  const err = state.errors ?? {};
  return (
    <form action={action} noValidate>
      {state.status === "error" && (
        <div className="notice is-error" role="alert">
          {state.message}
        </div>
      )}
      <input type="hidden" name="ts" value={ts} />
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" required maxLength={100} autoComplete="name" aria-invalid={!!err.name} aria-describedby={err.name ? "name-err" : undefined} />
        {err.name && <small id="name-err" style={{ color: "#b42318" }}>{err.name}</small>}
      </div>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" aria-invalid={!!err.email} aria-describedby={err.email ? "email-err" : undefined} />
        {err.email && <small id="email-err" style={{ color: "#b42318" }}>{err.email}</small>}
      </div>
      <div className="field">
        <label htmlFor="subject">Topic</label>
        <select id="subject" name="subject" required defaultValue={SUBJECTS[0]} aria-invalid={!!err.subject}>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required minLength={10} maxLength={5000} aria-invalid={!!err.message} aria-describedby={err.message ? "message-err" : undefined} />
        {err.message && <small id="message-err" style={{ color: "#b42318" }}>{err.message}</small>}
      </div>
      <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </button>
      <p className="fine-print">
        We use your details only to reply to you. See our <a href="/privacy">Privacy Policy</a>. For questions about an
        existing booking, contact Viator directly using the details in your confirmation email.
      </p>
    </form>
  );
}

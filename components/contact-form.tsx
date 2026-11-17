"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, List, Loader2, Mail, MessageSquare, Send, User } from "lucide-react";
import {
  CONTACT_LIMITS,
  CONTACT_SUBJECTS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "@/lib/contact-validation";

const EMPTY: ContactValues = { name: "", email: "", subject: "", message: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "subject", "message"];

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

/**
 * Contact form that posts to the form relay (FormSubmit), which emails the
 * message to the site owner. A success message is shown only when the relay
 * confirms delivery; anything else is reported as an error with the email
 * address as a fallback.
 */
export function ContactForm({ endpoint, email }: { endpoint: string; email: string }) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const sending = useRef(false);
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const errors: ContactErrors = validateContact(values);
  const visible = (field: ContactField) => (submitted || touched[field] ? errors[field] : undefined);

  const update = (field: ContactField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (status.state === "sent" || status.state === "error") setStatus({ state: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending.current) return; // ignore double clicks and repeated Enter presses
    setSubmitted(true);

    const first = FIELD_ORDER.find((f) => errors[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    sending.current = true;
    setStatus({ state: "sending" });
    const honeypot = new FormData(event.currentTarget).get("_honey");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          topic: values.subject,
          message: values.message.trim(),
          _subject: `LoanCalm contact: ${values.subject}`,
          _replyto: values.email.trim(),
          _template: "table",
          _captcha: "false",
          _honey: honeypot ?? "",
        }),
        signal: AbortSignal.timeout(20_000),
      });
      const data = (await response.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
      const ok = response.ok && (data?.success === true || data?.success === "true");

      if (ok) {
        setStatus({ state: "sent" });
        setValues(EMPTY);
        setTouched({});
        setSubmitted(false);
      } else if (data?.message && /activat/i.test(data.message)) {
        setStatus({
          state: "error",
          message: "The contact form is still being set up, so your message was not sent.",
        });
      } else {
        setStatus({ state: "error", message: "Your message could not be sent." });
      }
    } catch {
      setStatus({
        state: "error",
        message: "Your message could not be sent. Check your internet connection.",
      });
    } finally {
      sending.current = false;
    }
  };

  const isSending = status.state === "sending";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isSending} className="space-y-5">
      {status.state === "sent" && (
        <div role="status" className="flex gap-3 rounded-xl border border-accent/25 bg-accent-soft px-4 py-3 text-sm text-ink">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
          <p>
            <strong className="font-semibold">Thank you, your message has been sent.</strong> We’ll reply to the email
            address you gave us.
          </p>
        </div>
      )}
      {status.state === "error" && (
        <div role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <p>
            {status.message} Please try again, or email us directly at{" "}
            <a href={`mailto:${email}`} className="font-semibold underline underline-offset-2">
              {email}
            </a>
            .
          </p>
        </div>
      )}

      <Field id={`${id}-name`} label="Your Name" icon={<User />} error={visible("name")}>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={CONTACT_LIMITS.name + 20}
          placeholder="Enter your name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          {...a11y(`${id}-name`, visible("name"))}
          className={inputClass(Boolean(visible("name")))}
        />
      </Field>

      <Field id={`${id}-email`} label="Your Email" icon={<Mail />} error={visible("email")}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          {...a11y(`${id}-email`, visible("email"))}
          className={inputClass(Boolean(visible("email")))}
        />
      </Field>

      <Field id={`${id}-subject`} label="Subject" icon={<List />} error={visible("subject")}>
        <select
          id={`${id}-subject`}
          name="subject"
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
          {...a11y(`${id}-subject`, visible("subject"))}
          className={`${inputClass(Boolean(visible("subject")))} appearance-none pr-10 ${values.subject ? "" : "text-muted"}`}
        >
          <option value="" disabled>
            Select a topic
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s} className="text-ink">
              {s}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
        />
      </Field>

      <Field id={`${id}-message`} label="Message" icon={<MessageSquare />} iconTop error={visible("message")}>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          maxLength={CONTACT_LIMITS.messageMax + 100}
          placeholder="Write your message here…"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          {...a11y(`${id}-message`, visible("message"))}
          className={`${inputClass(Boolean(visible("message")))} h-auto min-h-32 resize-y py-3`}
        />
      </Field>

      {/* Spam trap: hidden from people and assistive tech; bots that fill it are dropped by the relay. */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <button
        type="submit"
        disabled={isSending}
        className="btn-primary h-12 w-full gap-2 rounded-xl text-base disabled:cursor-wait disabled:opacity-80"
      >
        {isSending ? (
          <>
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send aria-hidden="true" className="size-5" />
            Send Message
          </>
        )}
      </button>
      <p className="text-xs leading-relaxed text-muted">
        Your message is delivered to us by email through FormSubmit. Please don’t include account numbers or other
        sensitive financial details.
      </p>
    </form>
  );
}

function a11y(id: string, error?: string) {
  return {
    "aria-required": true as const,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

function inputClass(invalid: boolean) {
  return [
    "h-12 w-full min-w-0 rounded-xl border bg-white pl-11 pr-3.5 text-base text-ink placeholder:text-muted",
    "focus:outline-none focus:ring-2",
    invalid ? "border-danger focus:ring-danger/30" : "border-line-strong focus:border-accent focus:ring-accent/25",
  ].join(" ");
}

function Field({
  id,
  label,
  icon,
  iconTop = false,
  error,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  iconTop?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label} <span aria-hidden="true" className="text-danger">*</span>
        <span className="sr-only"> (required)</span>
      </label>
      <div className="relative mt-1.5">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-3.5 text-muted [&>svg]:size-5 ${iconTop ? "top-3" : "top-1/2 -translate-y-1/2"}`}
        >
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

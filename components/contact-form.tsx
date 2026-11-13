"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

/**
 * Prepares an email in the visitor's own mail app via a mailto: link.
 * Nothing is sent by this website, so no success message is shown.
 */
export function ContactForm({ email }: { email: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) {
      setError("Write a message before opening your email app.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({ subject: subject.trim() || "Question about the loan calculator", body: message });
    window.location.href = `mailto:${email}?${params.toString().replace(/\+/g, "%20")}`;
    setOpened(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-ink">
          Subject <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-lg border border-line-strong bg-white px-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "contact-message-error" : undefined}
          className="mt-1.5 w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        {error && (
          <p id="contact-message-error" className="mt-1.5 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>
      <button type="submit" className="btn-primary inline-flex items-center gap-2">
        <Mail aria-hidden="true" className="size-4" />
        Open in my email app
      </button>
      <p className="text-xs leading-relaxed text-muted" aria-live="polite">
        {opened
          ? "Your email app should have opened with a draft. The message is only sent when you press Send there. If nothing opened, email us directly at the address above."
          : "This form does not send anything itself. It opens a draft in your default email app, and you send it from there."}
      </p>
    </form>
  );
}

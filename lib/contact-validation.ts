/**
 * Contact form fields and validation. Pure, no imports, so it can be unit
 * tested directly with Node.
 */

export const CONTACT_SUBJECTS = [
  "General Question",
  "Calculator Issue",
  "Incorrect Calculation",
  "Feature Suggestion",
  "Website Feedback",
  "Other",
] as const;

export interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_LIMITS = { name: 100, email: 254, messageMin: 10, messageMax: 5000 } as const;

// Practical check: something@something.tld, no spaces, one @.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Enter your name.";
  else if (name.length > CONTACT_LIMITS.name) errors.name = `Use ${CONTACT_LIMITS.name} characters or fewer.`;

  if (!email) errors.email = "Enter your email address so we can reply.";
  else if (email.length > CONTACT_LIMITS.email || !EMAIL.test(email))
    errors.email = "Enter a valid email address, for example name@example.com.";

  if (!(CONTACT_SUBJECTS as readonly string[]).includes(values.subject)) errors.subject = "Choose a topic.";

  if (!message) errors.message = "Write your message.";
  else if (message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Add a little more detail (at least ${CONTACT_LIMITS.messageMin} characters).`;
  else if (message.length > CONTACT_LIMITS.messageMax)
    errors.message = `Keep your message under ${CONTACT_LIMITS.messageMax.toLocaleString("en-US")} characters.`;

  return errors;
}

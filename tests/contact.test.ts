import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT_SUBJECTS, validateContact } from "../lib/contact-validation.ts";

const valid = { name: "Ana", email: "ana@example.com", subject: "Calculator Issue", message: "The weekly result looks wrong." };

test("a complete message is valid", () => {
  assert.deepEqual(validateContact(valid), {});
});

test("every field is required", () => {
  const errors = validateContact({ name: " ", email: "", subject: "", message: "" });
  assert.deepEqual(Object.keys(errors).sort(), ["email", "message", "name", "subject"]);
});

test("email format is checked", () => {
  for (const bad of ["ana", "ana@", "ana@example", "ana @example.com", "@example.com", "a@b.c"]) {
    assert.ok(validateContact({ ...valid, email: bad }).email, `${bad} rejected`);
  }
  for (const good of ["ana@example.com", "a.b+tag@mail.co.uk", " ana@example.com "]) {
    assert.equal(validateContact({ ...valid, email: good }).email, undefined, `${good} accepted`);
  }
});

test("subject must be one of the listed topics", () => {
  assert.deepEqual([...CONTACT_SUBJECTS], [
    "General Question", "Calculator Issue", "Incorrect Calculation", "Feature Suggestion", "Website Feedback", "Other",
  ]);
  assert.ok(validateContact({ ...valid, subject: "Spam offer" }).subject);
});

test("message length limits", () => {
  assert.ok(validateContact({ ...valid, message: "short" }).message);
  assert.ok(validateContact({ ...valid, message: "x".repeat(5001) }).message);
  assert.ok(validateContact({ ...valid, name: "x".repeat(101) }).name);
});

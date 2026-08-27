import { isAxiosError } from "axios";

interface BackendErrorPayload {
  message?: string;
  errors?: { validation?: string[] };
}

/** Known backend messages translated for a nicer UX — falls back to the raw
 * backend message for anything not in this list, so new backend copy is never
 * silently hidden from the user. */
const MESSAGE_TRANSLATIONS: Record<string, string> = {
  "Invalid credentials": "Incorrect username or password.",
  "Email already registered": "This email is already registered.",
  "Username already taken": "This username is already taken.",
  "Phone number already registered": "This phone number is already registered.",
};

function translate(message: string): string {
  return MESSAGE_TRANSLATIONS[message] ?? message;
}

/** Extracts every human-readable error message from an API error response —
 * class-validator's `errors.validation` array when present (one entry per
 * failed field), otherwise the single top-level `message`. */
export function getApiErrorMessages(error: unknown): string[] {
  if (!isAxiosError(error)) return ["Something went wrong. Please try again."];

  const data = error.response?.data as BackendErrorPayload | undefined;
  if (data?.errors?.validation?.length) return data.errors.validation.map(translate);
  if (data?.message) return [translate(data.message)];
  return ["Something went wrong. Please try again."];
}

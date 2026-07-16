import { isAxiosError } from "axios";

interface BackendErrorPayload {
  message?: string;
  errors?: { validation?: string[] };
}

/** Known backend messages translated for a nicer UX — falls back to the raw
 * backend message for anything not in this list, so new backend copy is never
 * silently hidden from the user. */
const MESSAGE_TRANSLATIONS: Record<string, string> = {
  "Invalid credentials": "Tài khoản hoặc mật khẩu không đúng.",
  "Email already registered": "Email này đã được đăng ký.",
  "Username already taken": "Tên đăng nhập này đã được sử dụng.",
  "Phone number already registered": "Số điện thoại này đã được đăng ký.",
};

function translate(message: string): string {
  return MESSAGE_TRANSLATIONS[message] ?? message;
}

/** Extracts every human-readable error message from an API error response —
 * class-validator's `errors.validation` array when present (one entry per
 * failed field), otherwise the single top-level `message`. */
export function getApiErrorMessages(error: unknown): string[] {
  if (!isAxiosError(error)) return ["Đã có lỗi xảy ra. Vui lòng thử lại."];

  const data = error.response?.data as BackendErrorPayload | undefined;
  if (data?.errors?.validation?.length) return data.errors.validation.map(translate);
  if (data?.message) return [translate(data.message)];
  return ["Đã có lỗi xảy ra. Vui lòng thử lại."];
}

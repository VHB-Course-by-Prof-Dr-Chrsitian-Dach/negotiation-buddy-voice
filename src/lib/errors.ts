export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) return maybeMessage;
  }

  return fallback;
}

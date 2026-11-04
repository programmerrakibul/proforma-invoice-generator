import { ZodError } from "zod";

export type ActionResult<T> =
  | { ok: true; data: T; message?: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
      formErrors?: string[];
    };

/**
 * Converts a ZodError into a serializable ActionResult error shape.
 * Raw ZodError instances must never cross the server/client boundary.
 */
export function zodErrorToActionResult<T>(
  error: ZodError,
  message = "Validation failed"
): ActionResult<T> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "form";
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message ?? "Invalid value");
  }

  return {
    ok: false,
    message,
    fieldErrors,
    formErrors: error.issues.map((issue) => issue.message ?? "Invalid value"),
  };
}

function hasBodyWithMessage(
   error: unknown,
): error is { body: { message: string } } {
   return (
      typeof error === "object" &&
      error !== null &&
      "body" in error &&
      typeof (error as { body?: { message?: unknown } }).body?.message ===
         "string"
   );
}

function hasMessage(error: unknown): error is { message: string } {
   return (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
   );
}

export function extractErrorMessage(error: unknown, text: string): string {
   if (hasBodyWithMessage(error)) {
      return error.body.message;
   }
   if (hasMessage(error)) {
      return error.message;
   }
   return text;
}

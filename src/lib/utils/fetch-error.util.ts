export interface FetchError {
   status: number;
   body: {
      message: string;
      [key: string]: unknown;
   };
}

export default function isFetchError(error: unknown): error is FetchError {
   return (
      typeof error === "object" &&
      error !== null &&
      "body" in error &&
      typeof (error as FetchError).body?.message === "string"
   );
}

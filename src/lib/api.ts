import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Uniform JSON envelope so the frontend can rely on a stable shape.
export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

// Wrap a handler to translate thrown errors into clean responses.
export function handle(
  fn: () => Promise<Response>
): Promise<Response> {
  return fn().catch((err) => {
    if (err instanceof ZodError) {
      return fail("Validation failed", 422, err.flatten());
    }
    console.error(err);
    return fail("Internal server error", 500);
  });
}

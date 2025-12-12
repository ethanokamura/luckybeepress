import type { Context } from "hono";
import { validator } from "hono/validator";
import { z, type ZodType } from "zod";

type ValidationTarget = "json" | "query" | "param" | "form";

function zodValidator<T>(target: ValidationTarget, schema: ZodType<T>) {
  return validator(target, (value, c: Context) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      console.log(`Invalid request: ${parsed.error?.message}`);
      return c.json(
        {
          success: false,
          errors: parsed.error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }

    return parsed.data;
  });
}

// Helper for coercing string query params to boolean
export const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val: boolean | string) => {
    if (typeof val === "boolean") return val;
    return val === "true";
  })
  .optional();

export const body = <T>(schema: ZodType<T>) => zodValidator("json", schema);
export const query = <T>(schema: ZodType<T>) => zodValidator("query", schema);
export const param = <T>(schema: ZodType<T>) => zodValidator("param", schema);

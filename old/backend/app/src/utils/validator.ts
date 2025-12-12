import type { Context } from "hono";
import { validator } from "hono/validator";
import type { ZodType } from "zod";

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

export const body = <T>(schema: ZodType<T>) => zodValidator("json", schema);
export const query = <T>(schema: ZodType<T>) => zodValidator("query", schema);
export const param = <T>(schema: ZodType<T>) => zodValidator("param", schema);
export const form = <T>(schema: ZodType<T>) => zodValidator("form", schema);

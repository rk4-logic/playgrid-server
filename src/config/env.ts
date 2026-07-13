import "dotenv/config";

import { z } from "zod";
import type { StringValue } from "ms";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().positive(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  JWT_ACCESS_EXPIRES_IN: z.custom<StringValue>(),
  JWT_REFRESH_EXPIRES_IN: z.custom<StringValue>(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables");
  // eslint-disable-next-line no-console
  console.error(parsedEnv.error.format());

  process.exit(1);
}

export const env = parsedEnv.data;

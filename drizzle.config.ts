import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  schema: "./src/db/schemas.ts",
  dbCredentials: {
    connectionString: process.env.DB_CONNECTION_STRING!,
  },
} satisfies Config;

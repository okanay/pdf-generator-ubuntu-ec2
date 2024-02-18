import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schemas from "./schemas";

const connectionString = process.env.DB_CONNECTION_STRING || "";
const client = postgres(connectionString);
const db = drizzle(client, { schema: schemas });

export default db;

import { timestamp, text, uuid, pgTable, integer } from "drizzle-orm/pg-core";

export const pageData = pgTable("page_data", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  pageName: text("page_name").notNull(),
  visitCount: integer("visit_count").default(0),
  lastVisitedTime: timestamp("last_visited_time").defaultNow(),
});

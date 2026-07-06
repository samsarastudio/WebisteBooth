import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Design studio visitors (email sign-in history).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const table = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'designers'`,
  )

  if (table.length > 0) return

  await db.run(sql`CREATE TABLE \`designers\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`email\` text NOT NULL,
    \`first_seen_at\` text NOT NULL,
    \`last_seen_at\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );`)
  await db.run(sql`CREATE UNIQUE INDEX \`designers_email_idx\` ON \`designers\` (\`email\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`designers\`;`)
}

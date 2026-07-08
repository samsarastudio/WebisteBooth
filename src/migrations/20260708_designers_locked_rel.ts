import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Repairs the Designers collection schema.
 *
 * The original 20260706_designers migration created the `designers` table but
 * forgot to add the `designers_id` relation column to
 * `payload_locked_documents_rels`. Payload expects that column for every
 * collection, so its absence causes 500s on the admin panel and on any
 * document create/update (including design autosave and email sign-in).
 *
 * This migration is fully idempotent and also re-ensures the designers table
 * and the frame-design snapshot columns in case an earlier migration only
 * partially applied on a given database.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Ensure the designers table exists.
  const designersTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'designers'`,
  )
  if (designersTable.length === 0) {
    await db.run(sql`CREATE TABLE \`designers\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`email\` text NOT NULL,
      \`first_seen_at\` text NOT NULL,
      \`last_seen_at\` text NOT NULL,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );`)
    await db.run(
      sql`CREATE UNIQUE INDEX \`designers_email_idx\` ON \`designers\` (\`email\`);`,
    )
  }

  // 2. Ensure the designers_id relation column on payload_locked_documents_rels.
  const relsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'payload_locked_documents_rels'`,
  )
  if (relsTable.length > 0) {
    const relCols = await db.all<{ name: string }>(
      sql`PRAGMA table_info('payload_locked_documents_rels');`,
    )
    const relNames = new Set(relCols.map((c) => c.name))
    if (!relNames.has('designers_id')) {
      await db.run(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`designers_id\` integer REFERENCES \`designers\`(\`id\`);`,
      )
      await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_designers_id_idx\` ON \`payload_locked_documents_rels\` (\`designers_id\`);`,
      )
    }
  }

  // 3. Re-ensure frame-design snapshot columns (defensive).
  const designsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_designs'`,
  )
  if (designsTable.length > 0) {
    const cols = await db.all<{ name: string }>(sql`PRAGMA table_info('frame_designs');`)
    const names = new Set(cols.map((c) => c.name))
    if (!names.has('designer_email')) {
      await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`designer_email\` text;`)
      await db.run(
        sql`CREATE INDEX \`frame_designs_designer_email_idx\` ON \`frame_designs\` (\`designer_email\`);`,
      )
    }
    if (!names.has('label')) {
      await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`label\` text;`)
    }
    if (!names.has('last_saved_at')) {
      await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`last_saved_at\` text;`)
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // SQLite cannot drop columns safely; leave schema as-is on rollback.
  await db.run(sql`SELECT 1`)
}

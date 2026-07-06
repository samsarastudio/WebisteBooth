import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Frame design snapshot metadata (designer email, label, last saved time).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const designsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_designs'`,
  )

  if (designsTable.length === 0) return

  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('frame_designs');`)
  const names = new Set(columns.map((c) => c.name))

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

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // SQLite cannot drop columns safely; leave schema as-is on rollback.
  await db.run(sql`SELECT 1`)
}

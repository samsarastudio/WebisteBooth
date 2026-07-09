import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Adds event location and package recommendation fields to leads.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const leadsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'leads'`,
  )

  if (leadsTable.length === 0) return

  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('leads');`)
  const names = new Set(columns.map((c) => c.name))

  if (!names.has('event_city')) {
    await db.run(sql`ALTER TABLE \`leads\` ADD \`event_city\` text;`)
  }
  if (!names.has('postal_code')) {
    await db.run(sql`ALTER TABLE \`leads\` ADD \`postal_code\` text;`)
  }
  if (!names.has('package_recommendation_requested')) {
    await db.run(
      sql`ALTER TABLE \`leads\` ADD \`package_recommendation_requested\` integer DEFAULT 0;`,
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}

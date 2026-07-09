import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Adds event organisers section fields to site_settings (added to config Jul 6 without migration).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const siteSettingsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'site_settings'`,
  )

  if (siteSettingsTable.length === 0) return

  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('site_settings');`)
  const names = new Set(columns.map((c) => c.name))

  if (!names.has('show_event_organisers_section')) {
    await db.run(
      sql`ALTER TABLE \`site_settings\` ADD \`show_event_organisers_section\` integer DEFAULT 1;`,
    )
  }
  if (!names.has('event_organisers_title')) {
    await db.run(sql`ALTER TABLE \`site_settings\` ADD \`event_organisers_title\` text;`)
  }
  if (!names.has('event_organisers_body')) {
    await db.run(sql`ALTER TABLE \`site_settings\` ADD \`event_organisers_body\` text;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}

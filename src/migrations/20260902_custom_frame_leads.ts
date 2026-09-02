import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/** Custom magnet / name-plate enquiry fields on leads. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const leadsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'leads'`,
  )

  if (leadsTable.length === 0) return

  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('leads');`)
  const names = new Set(columns.map((c) => c.name))

  if (!names.has('name_plate_copy')) {
    await db.run(sql`ALTER TABLE \`leads\` ADD \`name_plate_copy\` text;`)
  }
  if (!names.has('magnet_color')) {
    await db.run(sql`ALTER TABLE \`leads\` ADD \`magnet_color\` text;`)
  }
  if (!names.has('book_photobooth')) {
    await db.run(sql`ALTER TABLE \`leads\` ADD \`book_photobooth\` integer DEFAULT 0;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}

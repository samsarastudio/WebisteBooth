import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Modular print paths + mode on frame_designs.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const table = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_designs'`,
  )
  if (table.length === 0) return

  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('frame_designs');`)
  const names = new Set(columns.map((c) => c.name))

  if (!names.has('print_mode')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_mode\` text;`)
  }
  if (!names.has('print_front_stl_path')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_front_stl_path\` text;`)
  }
  if (!names.has('print_back_stl_path')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_back_stl_path\` text;`)
  }
  if (!names.has('print_spacer_stl_path')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_spacer_stl_path\` text;`)
  }
  if (!names.has('print_manifest_path')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_manifest_path\` text;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}

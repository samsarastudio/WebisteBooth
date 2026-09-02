import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Adds Comfy Cloud print-model fields to frame_designs.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const table = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_designs'`,
  )
  if (table.length === 0) return

  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('frame_designs');`)
  const names = new Set(columns.map((c) => c.name))

  if (!names.has('print_model_status')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_model_status\` text DEFAULT 'idle';`)
  }
  if (!names.has('print_comfy_prompt_id')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_comfy_prompt_id\` text;`)
  }
  if (!names.has('print_model_error')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_model_error\` text;`)
  }
  if (!names.has('print_glb_path')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_glb_path\` text;`)
  }
  if (!names.has('print_stl_path')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_stl_path\` text;`)
  }
  if (!names.has('print_generated_at')) {
    await db.run(sql`ALTER TABLE \`frame_designs\` ADD \`print_generated_at\` text;`)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Frame configurator collections and lead design fields.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const templatesTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_templates'`,
  )

  if (templatesTable.length === 0) {
    await db.run(sql`CREATE TABLE \`frame_templates\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`name\` text NOT NULL,
      \`slug\` text NOT NULL,
      \`format\` text DEFAULT 'polaroid' NOT NULL,
      \`canvas_width\` numeric DEFAULT 400 NOT NULL,
      \`canvas_height\` numeric DEFAULT 500 NOT NULL,
      \`photo_slot_x\` numeric DEFAULT 40,
      \`photo_slot_y\` numeric DEFAULT 40,
      \`photo_slot_width\` numeric DEFAULT 320,
      \`photo_slot_height\` numeric DEFAULT 320,
      \`caption_zone_x\` numeric DEFAULT 40,
      \`caption_zone_y\` numeric DEFAULT 380,
      \`caption_zone_width\` numeric DEFAULT 320,
      \`caption_zone_height\` numeric DEFAULT 80,
      \`border_radius\` numeric DEFAULT 8,
      \`border_image_path\` text,
      \`active\` integer DEFAULT 1,
      \`sort_order\` numeric DEFAULT 0,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );`)
    await db.run(sql`CREATE UNIQUE INDEX \`frame_templates_slug_idx\` ON \`frame_templates\` (\`slug\`);`)
  }

  const ornamentsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_ornaments'`,
  )

  if (ornamentsTable.length === 0) {
    await db.run(sql`CREATE TABLE \`frame_ornaments\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`name\` text NOT NULL,
      \`slug\` text NOT NULL,
      \`category\` text DEFAULT 'geometric' NOT NULL,
      \`kind\` text DEFAULT 'image' NOT NULL,
      \`asset_path\` text,
      \`image_id\` integer,
      \`shape_type\` text,
      \`active\` integer DEFAULT 1,
      \`sort_order\` numeric DEFAULT 0,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
    );`)
    await db.run(sql`CREATE UNIQUE INDEX \`frame_ornaments_slug_idx\` ON \`frame_ornaments\` (\`slug\`);`)
    await db.run(sql`CREATE INDEX \`frame_ornaments_image_idx\` ON \`frame_ornaments\` (\`image_id\`);`)

    await db.run(sql`CREATE TABLE \`frame_ornaments_tags\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`tag\` text,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`frame_ornaments\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );`)
  }

  const designsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_designs'`,
  )

  if (designsTable.length === 0) {
    await db.run(sql`CREATE TABLE \`frame_designs\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`design_token\` text NOT NULL,
      \`state\` text NOT NULL,
      \`preview_image_id\` integer,
      \`photo_media_id\` integer,
      \`status\` text DEFAULT 'draft',
      \`lead_id\` integer,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      FOREIGN KEY (\`preview_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`photo_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
      FOREIGN KEY (\`lead_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE set null
    );`)
    await db.run(sql`CREATE UNIQUE INDEX \`frame_designs_design_token_idx\` ON \`frame_designs\` (\`design_token\`);`)
    await db.run(sql`CREATE INDEX \`frame_designs_lead_idx\` ON \`frame_designs\` (\`lead_id\`);`)
  }

  const stylesTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_styles'`,
  )
  if (stylesTable.length > 0) {
    const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('frame_styles');`)
    const names = new Set(columns.map((c) => c.name))
    if (!names.has('template_id')) {
      await db.run(
        sql`ALTER TABLE \`frame_styles\` ADD \`template_id\` integer REFERENCES \`frame_templates\`(\`id\`);`,
      )
    }
  }

  const stylesRels = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'frame_styles_rels'`,
  )
  if (stylesRels.length === 0 && stylesTable.length > 0) {
    await db.run(sql`CREATE TABLE \`frame_styles_rels\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`order\` integer,
      \`parent_id\` integer NOT NULL,
      \`path\` text NOT NULL,
      \`frame_ornaments_id\` integer,
      FOREIGN KEY (\`parent_id\`) REFERENCES \`frame_styles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY (\`frame_ornaments_id\`) REFERENCES \`frame_ornaments\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );`)
  }

  const leadsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'leads'`,
  )
  if (leadsTable.length > 0) {
    const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('leads');`)
    const names = new Set(columns.map((c) => c.name))
    if (!names.has('frame_design_id')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`frame_design_id\` integer REFERENCES \`frame_designs\`(\`id\`);`)
    }
    if (!names.has('frame_config')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`frame_config\` text;`)
    }
    if (!names.has('design_preview_id')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`design_preview_id\` integer REFERENCES \`media\`(\`id\`);`)
    }
  }

  const siteSettingsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'site_settings'`,
  )
  if (siteSettingsTable.length > 0) {
    const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('site_settings');`)
    const names = new Set(columns.map((c) => c.name))
    if (!names.has('show_design_page')) {
      await db.run(sql`ALTER TABLE \`site_settings\` ADD \`show_design_page\` integer DEFAULT 1;`)
    }
  }

  const relsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'payload_locked_documents_rels'`,
  )
  if (relsTable.length > 0) {
    const relColumns = await db.all<{ name: string }>(
      sql`PRAGMA table_info('payload_locked_documents_rels');`,
    )
    const relNames = new Set(relColumns.map((c) => c.name))
    if (!relNames.has('frame_templates_id')) {
      await db.run(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`frame_templates_id\` integer REFERENCES \`frame_templates\`(\`id\`);`,
      )
    }
    if (!relNames.has('frame_ornaments_id')) {
      await db.run(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`frame_ornaments_id\` integer REFERENCES \`frame_ornaments\`(\`id\`);`,
      )
    }
    if (!relNames.has('frame_designs_id')) {
      await db.run(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`frame_designs_id\` integer REFERENCES \`frame_designs\`(\`id\`);`,
      )
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`frame_designs\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`frame_ornaments_tags\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`frame_ornaments\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`frame_styles_rels\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`frame_templates\`;`)
}

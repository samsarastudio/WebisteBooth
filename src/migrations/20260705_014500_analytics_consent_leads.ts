import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Adds page-views analytics table and lead inquiry/response fields.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const pageViewsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'page_views'`,
  )

  if (pageViewsTable.length === 0) {
    await db.run(sql`CREATE TABLE \`page_views\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`path\` text NOT NULL,
      \`referrer\` text,
      \`session_id\` text,
      \`user_agent\` text,
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
    );`)
    await db.run(sql`CREATE INDEX \`page_views_path_idx\` ON \`page_views\` (\`path\`);`)
    await db.run(sql`CREATE INDEX \`page_views_session_id_idx\` ON \`page_views\` (\`session_id\`);`)
    await db.run(sql`CREATE INDEX \`page_views_updated_at_idx\` ON \`page_views\` (\`updated_at\`);`)
    await db.run(sql`CREATE INDEX \`page_views_created_at_idx\` ON \`page_views\` (\`created_at\`);`)
  }

  const leadsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'leads'`,
  )

  if (leadsTable.length > 0) {
    const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('leads');`)
    const names = new Set(columns.map((c) => c.name))

    if (!names.has('intent')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`intent\` text DEFAULT 'contact';`)
    }
    if (!names.has('privacy_consent_at')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`privacy_consent_at\` text;`)
    }
    if (!names.has('response_message')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`response_message\` text;`)
    }
    if (!names.has('send_response')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`send_response\` integer DEFAULT 0;`)
    }
    if (!names.has('last_responded_at')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`last_responded_at\` text;`)
    }
    if (!names.has('last_response_preview')) {
      await db.run(sql`ALTER TABLE \`leads\` ADD \`last_response_preview\` text;`)
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

    if (!relNames.has('page_views_id')) {
      await db.run(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`page_views_id\` integer REFERENCES \`page_views\`(\`id\`);`,
      )
      await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_page_views_id_idx\` ON \`payload_locked_documents_rels\` (\`page_views_id\`);`,
      )
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`page_views\`;`)
}

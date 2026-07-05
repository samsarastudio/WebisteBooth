import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Adds blog/posts schema to databases created before the blog feature.
 * Safe to run on DBs that already have these tables/columns (no-ops).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const postsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'posts'`,
  )

  if (postsTable.length === 0) {
    await db.run(sql`CREATE TABLE \`posts\` (
      \`id\` integer PRIMARY KEY NOT NULL,
      \`title\` text NOT NULL,
      \`slug\` text NOT NULL,
      \`excerpt\` text NOT NULL,
      \`content\` text NOT NULL,
      \`featured_image_id\` integer,
      \`category\` text DEFAULT 'tips' NOT NULL,
      \`author\` text DEFAULT 'FrameFlix Team',
      \`status\` text DEFAULT 'draft' NOT NULL,
      \`published_at\` text,
      \`meta_description\` text,
      \`source\` text DEFAULT 'admin',
      \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
    );`)
    await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
    await db.run(sql`CREATE INDEX \`posts_featured_image_idx\` ON \`posts\` (\`featured_image_id\`);`)
    await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
    await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)

    await db.run(sql`CREATE TABLE \`posts_tags\` (
      \`_order\` integer NOT NULL,
      \`_parent_id\` integer NOT NULL,
      \`id\` text PRIMARY KEY NOT NULL,
      \`tag\` text NOT NULL,
      FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
    );`)
    await db.run(sql`CREATE INDEX \`posts_tags_order_idx\` ON \`posts_tags\` (\`_order\`);`)
    await db.run(sql`CREATE INDEX \`posts_tags_parent_id_idx\` ON \`posts_tags\` (\`_parent_id\`);`)
  }

  const siteSettingsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'site_settings'`,
  )

  if (siteSettingsTable.length > 0) {
    const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('site_settings');`)
    const names = new Set(columns.map((c) => c.name))

    if (!names.has('show_blog_page')) {
      await db.run(sql`ALTER TABLE \`site_settings\` ADD \`show_blog_page\` integer DEFAULT 1;`)
    }
    if (!names.has('show_blog_preview')) {
      await db.run(sql`ALTER TABLE \`site_settings\` ADD \`show_blog_preview\` integer DEFAULT 1;`)
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

    if (!relNames.has('posts_id')) {
      await db.run(
        sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`posts_id\` integer REFERENCES \`posts\`(\`id\`);`,
      )
      await db.run(
        sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`,
      )
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`posts_tags\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`posts\`;`)
}

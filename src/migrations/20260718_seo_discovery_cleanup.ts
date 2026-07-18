import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * SEO / marketing readiness:
 * - Unpublish off-brand OpenClaw posts (360/AI/vintage/enclosed booths — not FrameFlix product)
 * - Add optional GBP / social URL columns for footer discovery links
 * - Align default contact email to the public domain when still on the old default
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const postsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'posts'`,
  )

  if (postsTable.length > 0) {
    await db.run(sql`
      UPDATE \`posts\`
      SET \`status\` = 'draft'
      WHERE \`status\` = 'published'
        AND (
          lower(\`slug\`) LIKE '%360%'
          OR lower(\`slug\`) LIKE '%ai-photo-booth%'
          OR lower(\`slug\`) LIKE '%ai_photo_booth%'
          OR lower(\`slug\`) LIKE '%vintage-photo-booth%'
          OR lower(\`slug\`) LIKE '%enclosed-photo-booth%'
          OR lower(\`slug\`) LIKE '%what-everyone-is-doing-with-photo-booths%'
          OR lower(\`title\`) LIKE '%360 photo booth%'
          OR lower(\`title\`) LIKE '%ai photo booth%'
          OR lower(\`title\`) LIKE '%vintage photo booth%'
          OR lower(\`title\`) LIKE '%enclosed photo booth%'
        )
    `)
  }

  const siteSettingsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'site_settings'`,
  )

  if (siteSettingsTable.length === 0) return

  const columns = await db.all<{ name: string }>(sql`PRAGMA table_info('site_settings');`)
  const names = new Set(columns.map((c) => c.name))

  if (!names.has('google_business_url')) {
    await db.run(sql`ALTER TABLE \`site_settings\` ADD \`google_business_url\` text;`)
  }
  if (!names.has('instagram_url')) {
    await db.run(sql`ALTER TABLE \`site_settings\` ADD \`instagram_url\` text;`)
  }
  if (!names.has('facebook_url')) {
    await db.run(sql`ALTER TABLE \`site_settings\` ADD \`facebook_url\` text;`)
  }

  await db.run(sql`
    UPDATE \`site_settings\`
    SET \`email\` = 'hello@inmomentservices.com'
    WHERE \`email\` = 'frameflix@inmoment.com'
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Non-destructive: leave draft posts and new columns in place
  void db
}

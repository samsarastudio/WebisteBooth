import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Unpublish off-topic blog posts (test content, US-focused holiday posts)
 * and clear the placeholder phone number from site settings.
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
          lower(\`title\`) LIKE '%test post%'
          OR lower(\`slug\`) LIKE '%test-post%'
          OR lower(\`slug\`) LIKE '%test_post%'
          OR lower(\`title\`) LIKE '%july 4%'
          OR lower(\`title\`) LIKE '%4th of july%'
          OR lower(\`title\`) LIKE '%fourth of july%'
          OR lower(\`title\`) LIKE '%independence day%'
          OR lower(\`title\`) LIKE '%america250%'
          OR lower(\`title\`) LIKE '%america 250%'
          OR lower(\`slug\`) LIKE '%july-4%'
          OR lower(\`slug\`) LIKE '%july_4%'
          OR lower(\`slug\`) LIKE '%4th-of-july%'
          OR lower(\`slug\`) LIKE '%independence-day%'
          OR lower(\`slug\`) LIKE '%america250%'
          OR lower(\`slug\`) LIKE '%america-250%'
        )
    `)
  }

  const siteSettingsTable = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'site_settings'`,
  )

  if (siteSettingsTable.length > 0) {
    await db.run(sql`
      UPDATE \`site_settings\`
      SET \`phone\` = ''
      WHERE \`phone\` = '(416) 555-1234'
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Non-destructive: leave unpublished posts as draft
  void db
}

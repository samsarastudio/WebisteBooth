import * as migration_20260705_042147_initial from './20260705_042147_initial';
import * as migration_20260705_051000_add_posts_blog from './20260705_051000_add_posts_blog';
import * as migration_20260705_014500_analytics_consent_leads from './20260705_014500_analytics_consent_leads';
import * as migration_20260705_031000_frame_configurator from './20260705_031000_frame_configurator';
import * as migration_20260706_design_snapshot_fields from './20260706_design_snapshot_fields';
import * as migration_20260706_designers from './20260706_designers';
import * as migration_20260708_designers_locked_rel from './20260708_designers_locked_rel';
import * as migration_20260708_content_trust_cleanup from './20260708_content_trust_cleanup';
import * as migration_20260709_site_settings_event_organisers from './20260709_site_settings_event_organisers';
import * as migration_20260709_lead_location_fields from './20260709_lead_location_fields';
import * as migration_20260718_seo_discovery_cleanup from './20260718_seo_discovery_cleanup';

export const migrations = [
  {
    up: migration_20260705_042147_initial.up,
    down: migration_20260705_042147_initial.down,
    name: '20260705_042147_initial'
  },
  {
    up: migration_20260705_051000_add_posts_blog.up,
    down: migration_20260705_051000_add_posts_blog.down,
    name: '20260705_051000_add_posts_blog'
  },
  {
    up: migration_20260705_014500_analytics_consent_leads.up,
    down: migration_20260705_014500_analytics_consent_leads.down,
    name: '20260705_014500_analytics_consent_leads'
  },
  {
    up: migration_20260705_031000_frame_configurator.up,
    down: migration_20260705_031000_frame_configurator.down,
    name: '20260705_031000_frame_configurator'
  },
  {
    up: migration_20260706_design_snapshot_fields.up,
    down: migration_20260706_design_snapshot_fields.down,
    name: '20260706_design_snapshot_fields'
  },
  {
    up: migration_20260706_designers.up,
    down: migration_20260706_designers.down,
    name: '20260706_designers'
  },
  {
    up: migration_20260708_designers_locked_rel.up,
    down: migration_20260708_designers_locked_rel.down,
    name: '20260708_designers_locked_rel'
  },
  {
    up: migration_20260708_content_trust_cleanup.up,
    down: migration_20260708_content_trust_cleanup.down,
    name: '20260708_content_trust_cleanup'
  },
  {
    up: migration_20260709_site_settings_event_organisers.up,
    down: migration_20260709_site_settings_event_organisers.down,
    name: '20260709_site_settings_event_organisers'
  },
  {
    up: migration_20260709_lead_location_fields.up,
    down: migration_20260709_lead_location_fields.down,
    name: '20260709_lead_location_fields'
  },
  {
    up: migration_20260718_seo_discovery_cleanup.up,
    down: migration_20260718_seo_discovery_cleanup.down,
    name: '20260718_seo_discovery_cleanup'
  },
];

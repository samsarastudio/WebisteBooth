import * as migration_20260705_042147_initial from './20260705_042147_initial';
import * as migration_20260705_051000_add_posts_blog from './20260705_051000_add_posts_blog';

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
];

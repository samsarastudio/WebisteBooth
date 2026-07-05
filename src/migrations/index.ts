import * as migration_20260705_042147_initial from './20260705_042147_initial';

export const migrations = [
  {
    up: migration_20260705_042147_initial.up,
    down: migration_20260705_042147_initial.down,
    name: '20260705_042147_initial'
  },
];

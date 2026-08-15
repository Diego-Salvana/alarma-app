import { vi } from 'vitest';

import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

// AnalogJS uses the Angular 20 names for these APIs; Angular 19.2 exposes their equivalents differently.
vi.mock('@angular/core', async (importOriginal) => {
  const core = await importOriginal<typeof import('@angular/core')>();

  return {
    ...core,
    provideZonelessChangeDetection: core.provideExperimentalZonelessChangeDetection
  };
});

vi.mock('@angular/core/testing', async (importOriginal) => {
  const testing = await importOriginal<typeof import('@angular/core/testing')>();

  return {
    ...testing,
    ɵgetCleanupHook: (afterEach: boolean) => () => {
      if (afterEach) {
        testing.getTestBed().resetTestingModule();
      }
    }
  };
});

setupTestBed({ zoneless: true });

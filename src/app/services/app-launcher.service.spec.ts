import { TestBed } from '@angular/core/testing';

import { AppLauncherService } from './app-launcher.service';

describe('AppLauncherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppLauncherService = TestBed.get(AppLauncherService);
    expect(service).toBeTruthy();
  });
});

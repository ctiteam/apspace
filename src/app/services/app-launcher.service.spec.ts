import { TestBed } from '@angular/core/testing';

import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AppLauncherService } from './app-launcher.service';

describe('AppLauncherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AppAvailability, useValue: {} },
        { provide: InAppBrowser, useValue: {} },
      ]
    });
  });

  it('should be created', () => {
    const service: AppLauncherService = TestBed.get(AppLauncherService);
    expect(service).toBeTruthy();
  });
});

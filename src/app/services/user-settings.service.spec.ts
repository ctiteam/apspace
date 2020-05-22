import { TestBed } from '@angular/core/testing';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StatusBar, useValue: {} },
        { provide: Storage, useValue: {} },
      ]
    });
  });

  it('should be created', () => {
    const service: UserSettingsService = TestBed.inject(UserSettingsService);
    expect(service).toBeTruthy();
  });
});

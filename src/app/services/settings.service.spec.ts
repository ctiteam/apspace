import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Storage, useValue: storageSpy },
      ]
    });
  });

  it('should be created', () => {
    storageSpy.get.and.returnValue(Promise.resolve(null));
    const service: SettingsService = TestBed.inject(SettingsService);
    expect(service).toBeTruthy();
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });
});

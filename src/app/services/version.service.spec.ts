import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';

import { VersionService } from './version.service';
import { WsApiService } from './ws-api.service';

describe('VersionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WsApiService, useValue: {} },
        { provide: InAppBrowser, useValue: {} },
        { provide: Network, useValue: {} },
        { provide: Storage, useValue: {} },
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', () => {
    const service: VersionService = TestBed.get(VersionService);
    expect(service).toBeTruthy();
  });
});

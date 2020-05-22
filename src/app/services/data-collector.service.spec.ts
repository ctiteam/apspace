import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Device } from '@ionic-native/device/ngx';

import { DataCollectorService } from './data-collector.service';
import { VersionService } from './version.service';
import { WsApiService } from './ws-api.service';

describe('DataCollectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Device, useValue: {} },
        { provide: VersionService, useValue: {} },
        { provide: WsApiService, useValue: {} },
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', () => {
    const service: DataCollectorService = TestBed.inject(DataCollectorService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ChangePasswordService } from './change-password.service';
import { WsApiService } from './ws-api.service';

describe('ChangePasswordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WsApiService, useValue: {} },
      ]
    });
  });

  it('should be created', () => {
    const service: ChangePasswordService = TestBed.get(ChangePasswordService);
    expect(service).toBeTruthy();
  });
});

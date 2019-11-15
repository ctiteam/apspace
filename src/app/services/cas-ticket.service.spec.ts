import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { CasTicketService } from './cas-ticket.service';
import { SettingsService } from './settings.service';

describe('CasTicketService', () => {
  let storage: { get: jasmine.Spy };

  beforeEach(() => {
    storage = jasmine.createSpyObj('Storage', ['get']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: Storage, useValue: storage },
      ]
    });
  });

  it('should be created', () => {
    storage.get.and.callFake(() => Promise.resolve(null));

    const service: CasTicketService = TestBed.get(CasTicketService);
    expect(service).toBeTruthy();
  });
});

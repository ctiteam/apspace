import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Badge } from '@ionic-native/badge/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { CasTicketService } from './cas-ticket.service';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CasTicketService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: FirebaseX, useValue: {} },
        { provide: Platform, useValue: {} },
        { provide: Network, useValue: {} },
        { provide: Storage, useValue: {} },
        { provide: Badge, useValue: {} },
      ]
    });
  });

  it('should be created', () => {
    const service: NotificationService = TestBed.inject(NotificationService);
    expect(service).toBeTruthy();
  });
});

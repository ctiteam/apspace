import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FCM } from '@ionic-native/fcm/ngx';
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
        { provide: FCM, useValue: {} },
        { provide: Platform, useValue: {} },
        { provide: Network, useValue: {} },
        { provide: Storage, useValue: {} },
      ]
    });
  });

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });
});

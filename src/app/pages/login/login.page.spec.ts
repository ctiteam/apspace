import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';

import {
  CasTicketService, DataCollectorService, NotificationService, SettingsService,
  WsApiService,
} from '../../services';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let casSpy: jasmine.SpyObj<CasTicketService>;
  let snapshotStub: Partial<ActivatedRouteSnapshot>;

  beforeEach(async(() => {
    casSpy = jasmine.createSpyObj('SettingsService', ['getTGT']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginPage],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: snapshotStub } },
        { provide: CasTicketService, useValue: casSpy },
        { provide: DataCollectorService, useValue: {} },
        { provide: InAppBrowser, useValue: {} },
        { provide: ModalController, useValue: {} },
        { provide: Network, useValue: {} },
        { provide: NotificationService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: WsApiService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    snapshotStub = { queryParams: {} };
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve tgt', () => {
    casSpy.getTGT.and.returnValue(of('tgt'));

    component.apkey = 'TP004112';
    component.password = 'hu99uh1';
    component.login();

    expect(casSpy.getTGT).toHaveBeenCalledTimes(1);
  });
});

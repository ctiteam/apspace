import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NEVER } from 'rxjs';

import { Role } from '../../interfaces';
import {
  SettingsService, StudentTimetableService, WsApiService,
} from '../../services';
import { IsPurePipe } from './is-pure.pipe';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let settings: jasmine.SpyObj<SettingsService>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let ws: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    settings = jasmine.createSpyObj('SettingsService', ['get', 'get$']);
    storageSpy = jasmine.createSpyObj('Storage', ['get']);
    ws = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [SettingsPage, IsPurePipe],
      providers: [
        { provide: ModalController, useValue: {} },
        { provide: NavController, useValue: {} },
        { provide: SettingsService, useValue: settings },
        { provide: Storage, useValue: storageSpy },
        { provide: StudentTimetableService, useValue: {} },
        { provide: WsApiService, useValue: ws },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  it('should create', () => {
    ws.get.and.returnValue(NEVER);
    settings.get$.and.returnValue(NEVER);
    storageSpy.get.and.returnValue(Promise.resolve(Role.Student));

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});

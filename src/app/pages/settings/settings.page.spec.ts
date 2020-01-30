import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { BehaviorSubject, NEVER } from 'rxjs';

import {
  SettingsService, StudentTimetableService, UserSettingsService, WsApiService
} from '../../services';
import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let settings: jasmine.SpyObj<SettingsService>;
  let ws: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    const userSettingsServiceStub = {
      getMenuUI: () => NEVER,
      getBusShuttleServiceSettings: () => NEVER,
      timetable: new BehaviorSubject({ blacklists: [] }),
      theme: new BehaviorSubject(''),
    };
    settings = jasmine.createSpyObj('SettingsService', ['get']);
    ws = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      providers: [
        { provide: ModalController, useValue: {} },
        { provide: NavController, useValue: {} },
        { provide: SettingsService, useValue: settings },
        { provide: StudentTimetableService, useValue: {} },
        { provide: UserSettingsService, useValue: userSettingsServiceStub },
        { provide: WsApiService, useValue: ws },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  it('should create', () => {
    ws.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});

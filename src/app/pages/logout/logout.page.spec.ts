import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import {
  DataCollectorService, NotificationService, SettingsService
} from '../../services';
import { LogoutPage } from './logout.page';

describe('LogoutPage', () => {
  let component: LogoutPage;
  let fixture: ComponentFixture<LogoutPage>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let platformSpy: jasmine.SpyObj<Platform>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async(() => {
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateRoot']);
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    settingsSpy = jasmine.createSpyObj('SettingsService', ['clear']);
    storageSpy = jasmine.createSpyObj('Storage', ['clear']);

    TestBed.configureTestingModule({
      declarations: [LogoutPage],
      providers: [
        { provide: DataCollectorService, useValue: {} },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: NotificationService, useValue: {} },
        { provide: Platform, useValue: platformSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: Storage, useValue: storageSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(navCtrlSpy.navigateRoot).toHaveBeenCalledWith('/login', { replaceUrl: true });
    expect(settingsSpy.clear).toHaveBeenCalledTimes(1);
    expect(storageSpy.clear).toHaveBeenCalledTimes(1);
  });
});

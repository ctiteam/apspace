import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular';
import { ChartModule } from 'angular2-chartjs';
import { DragulaModule, DragulaService } from 'ng2-dragula';
import { NEVER, of } from 'rxjs';

import { Settings } from '../../interfaces';
import {
  NewsService, NotificationService, SettingsService, UserSettingsService,
  WsApiService
} from '../../services';
import { DisabledPipe } from './disabled.pipe';
import { SectionNamePipe } from './section-name.pipe';
import { StaffDashboardPage } from './staff-dashboard.page';

describe('StaffDashboardPage', () => {
  let component: StaffDashboardPage;
  let fixture: ComponentFixture<StaffDashboardPage>;
  let newsSpy: jasmine.SpyObj<NewsService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let userSettingsSpy: jasmine.SpyObj<UserSettingsService>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    newsSpy = jasmine.createSpyObj('NewsService', ['get', 'getSlideshow']);
    notificationSpy = jasmine.createSpyObj('NotificationService', ['getMessages']);
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get$']);
    userSettingsSpy = jasmine.createSpyObj('UserSettingsService',
      ['getAccentColorRgbaValue']);

    TestBed.configureTestingModule({
      declarations: [StaffDashboardPage, DisabledPipe, SectionNamePipe],
      providers: [
        DragulaService,
        { provide: ModalController, useValue: {} },
        { provide: NavController, useValue: {} },
        { provide: NewsService, useValue: newsSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: UserSettingsService, useValue: userSettingsSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: WsApiService, useValue: wsSpy },
      ],
      imports: [ChartModule, DragulaModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    newsSpy.get.and.returnValue(NEVER);
    settingsSpy.get$.and.callFake(<K extends keyof Settings>(key: K) => {
      switch (key) {
        case 'dashboardSections': return of([] as Settings[K]);
        default: return NEVER;
      }
    });
    notificationSpy.getMessages.and.returnValue(NEVER);
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(StaffDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(wsSpy.get).toHaveBeenCalledTimes(6);
  });
});

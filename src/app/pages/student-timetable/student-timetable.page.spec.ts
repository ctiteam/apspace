import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture, TestBed, async, fakeAsync, tick
} from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, NEVER } from 'rxjs';

import {
  ActivatedRouteStub, RouterLinkDirectiveStub, asyncData
} from '../../../testing';
import { Role, Settings } from '../../interfaces';
import {
  SettingsService, StudentTimetableService, UserSettingsService, WsApiService
} from '../../services';
import { ClassesPipe } from './classes.pipe';
import { GenPipe } from './gen.pipe';
import { StrToColorPipe } from './str-to-color.pipe';
import { StudentTimetablePage } from './student-timetable.page';
import { ThedayPipe } from './theday.pipe';
import { TheWeekPipe } from './theweek.pipe';

function settingsFake<K extends keyof Settings>(data: Settings): (key: K) => Settings[K] {
  return key => {
    if (data[key] !== undefined) {
      return data[key];
    } else {
      fail(key);
    }
  };
}

describe('StudentTimetablePage', () => {
  let activatedRoute: ActivatedRouteStub;
  let component: StudentTimetablePage;
  let fixture: ComponentFixture<StudentTimetablePage>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;
  let studentTimetableSpy: jasmine.SpyObj<StudentTimetableService>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get', 'set']);
    studentTimetableSpy = jasmine.createSpyObj('StudentTimetableService', ['get']);
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);
    const userSettingsServiceStub = { timetable: new BehaviorSubject({ blacklists: [] }) };

    TestBed.configureTestingModule({
      declarations: [
        ClassesPipe,
        GenPipe,
        RouterLinkDirectiveStub,
        StudentTimetablePage,
        TheWeekPipe,
        ThedayPipe,
        StrToColorPipe,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: InAppBrowser, useValue: {} },
        { provide: ModalController, useValue: {} },
        { provide: Router, useValue: { url: '/' } },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: StudentTimetableService, useValue: studentTimetableSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceStub },
        { provide: WsApiService, useValue: wsSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('student', () => {
    it('should create (default load)', fakeAsync(() => {
      activatedRoute.setParams({});
      studentTimetableSpy.get.and.returnValue(NEVER);
      settingsSpy.get.and.callFake(settingsFake({
        intakeHistory: null,
        role: Role.Student,
        viewWeek: false,
      } as Settings));
      const intake = 'UC3F1906CS(DA)';
      wsSpy.get.and.returnValue(asyncData({
        STUDENT_NUMBER: '',
        EMGS_COUNTRY_CODE: '',
        STUDENT_EMAIL: '',
        DATE: '',
        COUNTRY: '',
        NAME: '',
        INTAKE: intake,
        PROGRAMME: '',
        MENTOR_SAMACCOUNTNAME: '',
        PL_SAMACCOUNTNAME: '',
        STUDENT_STATUS: '',
        IC_PASSPORT_NO: '',
        INTAKE_STATUS: '',
        PHOTO_NO: null,
        PL_NAME: '',
        MENTOR_NAME: '',
        PROVIDER_CODE: '',
        BLOCK: true,
        MESSAGE: '',
      }));

      fixture = TestBed.createComponent(StudentTimetablePage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(wsSpy.get).toHaveBeenCalledTimes(1);
      expect(wsSpy.get).toHaveBeenCalledWith('/student/profile', { caching: 'cache-only' });

      tick(); // ws subscribe profile
      expect(settingsSpy.set).toHaveBeenCalledTimes(1);
      expect(settingsSpy.set).toHaveBeenCalledWith('intakeHistory', [intake]);
      expect(component.intake).toEqual(intake);
    }));
  });

  describe('lecturer', () => {
    it('should create (default load)', () => {
      activatedRoute.setParams({});
      studentTimetableSpy.get.and.returnValue(NEVER);
      settingsSpy.get.and.callFake(settingsFake({
        intakeHistory: null,
        role: Role.Lecturer,
        viewWeek: false,
      } as Settings));

      fixture = TestBed.createComponent(StudentTimetablePage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(wsSpy.get).not.toHaveBeenCalled();
      expect(settingsSpy.set).toHaveBeenCalledTimes(1);
      expect(settingsSpy.set).toHaveBeenCalledWith('intakeHistory', []);
    });
  });
});

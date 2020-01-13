import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture, TestBed, async, fakeAsync, tick
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonSegment, IonSegmentButton, ModalController, RadioValueAccessor, SelectValueAccessor, TextValueAccessor } from '@ionic/angular';
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
      imports: [FormsModule],
      declarations: [
        // ionic
        IonSegment,
        IonSegmentButton,
        RadioValueAccessor,
        SelectValueAccessor,
        TextValueAccessor,

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
      const intake = 'UCFF0000CTI';
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
      expect(studentTimetableSpy.get).toHaveBeenCalledTimes(1);
    }));

    it('should display classes', fakeAsync(() => {
      activatedRoute.setParams({});
      const monday = new Date();
      monday.setHours(0, 0, 0, 0);
      monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
      const intake = 'UC3F1906CS(DA)';
      // one timetable every day
      const timetables = [...Array(7).keys()].map(n => {
        const d = new Date(new Date(monday).setDate(monday.getDate() + n));
        return {
          INTAKE: intake,
          MODID: 'CT100-0-0-XXXX-L',
          DAY: '',
          LOCATION: 'APU',
          ROOM: 'ROOM',
          LECTID: 'PRO',
          NAME: `Professor ${n}`,
          SAMACCOUNTNAME: 'professor',
          DATESTAMP: '',
          DATESTAMP_ISO: `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`,
          TIME_FROM: '08:30 AM',
          TIME_TO: '10:30 PM',
        };
      });
      studentTimetableSpy.get.and.returnValue(asyncData(timetables));
      settingsSpy.get.and.callFake(settingsFake({
        intakeHistory: null,
        role: Role.Student,
        viewWeek: false,
      } as Settings));
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
      fixture.detectChanges(); // render intake
      expect(settingsSpy.set).toHaveBeenCalledTimes(1);
      expect(settingsSpy.set).toHaveBeenCalledWith('intakeHistory', [intake]);
      expect(component.intake).toEqual(intake);
      expect(studentTimetableSpy.get).toHaveBeenCalledTimes(1);
      expect(studentTimetableSpy.get).toHaveBeenCalledWith(false);

      tick(); // subscribe student timetable
      fixture.detectChanges(); // render days
      expect(component.availableWeek.length).toEqual(1);
      expect(component.availableWeek[0].getTime()).toEqual(new Date(timetables[0].DATESTAMP_ISO).setHours(0, 0, 0, 0));
      expect(component.selectedWeek.getTime()).toEqual(new Date(timetables[0].DATESTAMP_ISO).setHours(0, 0, 0, 0));
      expect(component.availableDate.length).toEqual(7);
      expect(component.availableDays).toEqual(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);
      expect(component.selectedDate.getTime()).toEqual(new Date(component.availableDate[0]).setHours(0, 0, 0, 0));

      // clicks each day
      const weekDe = fixture.debugElement.query(By.css('ion-segment'));
      weekDe.children[0].triggerEventHandler('click', { button: 0 });
      fixture.checkNoChanges(); // no changes to click on the same day
      expect(fixture.nativeElement.querySelector('ion-grid').textContent).toContain('Professor 0');
      weekDe.children[1].triggerEventHandler('click', { button: 0 });
      // TODO: detect change event
      // console.log(weekDe);
      // tick();
      // fixture.detectChanges();
      // expect(component.selectedDate.getTime()).toEqual(new Date(component.availableDate[1]).setHours(0, 0, 0, 0));
      // expect(fixture.nativeElement.querySelector('ion-grid').textContent).toContain('Professor 1');
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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonSelect, ModalController } from '@ionic/angular';
import { NEVER, of } from 'rxjs';

import { Classcode, StaffProfile } from '../../../interfaces';
import { StudentTimetableService, WsApiService } from '../../../services';
import { ClassesPage } from './classes.page';

describe('ClassesPage', () => {
  let component: ClassesPage;
  let fixture: ComponentFixture<ClassesPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let ttSpy: jasmine.SpyObj<StudentTimetableService>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    ttSpy = jasmine.createSpyObj('StudentTimetableService', ['get']);
    wsSpy = jasmine.createSpyObj('WsApiService', ['get', 'post']);

    TestBed.configureTestingModule({
      declarations: [ClassesPage, IonSelect],
      providers: [
        { provide: ModalController, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: StudentTimetableService, useValue: ttSpy },
        { provide: WsApiService, useValue: wsSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    ttSpy.get.and.returnValue(NEVER);
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(ClassesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    const markEl = fixture.nativeElement.querySelector('ion-grid > ion-row > ion-col > ion-button');
    expect(markEl.disabled).toBeTrue();
    expect(wsSpy.post).not.toHaveBeenCalled();
  });

  const autoTests = [
    { classType: 'Lecture', classAbbr: 'L' },
    { classType: 'Tutorial', classAbbr: 'T1' },
    { classType: 'Tutorial', classAbbr: 'T2' },
    { classType: 'Lab', classAbbr: 'LAB' },
  ];

  autoTests.forEach(test => {
    it(`should auto match ${test.classType} (${test.classAbbr}) class and navigate`, () => {
      const d = new Date();
      const hh = ('0' + (d.getHours() % 12 || 12)).slice(-2);
      const period = d.getHours() < 12 ? 'AM' : 'PM';

      const classcode = `XXX-${test.classAbbr}-XXX`;
      const date = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
      const startTime = `${hh}:${('0' + d.getMinutes()).slice(-2)} ${period}`;
      const endTime = `${hh}:${('0' + (d.getMinutes() + 1)).slice(-2)} ${period}`;
      const classType = test.classType;

      ttSpy.get.and.returnValue(of([{
        INTAKE: 'XXX',
        MODID: `XXX-${test.classAbbr}`,
        DAY: 'SUN',
        LOCATION: 'XXX',
        ROOM: 'XXX',
        LECTID: 'DOE',
        NAME: 'John Doe',
        SAMACCOUNTNAME: 'john.doe',
        DATESTAMP: 'XXX',
        DATESTAMP_ISO: date,
        TIME_FROM: startTime,
        TIME_TO: endTime,
      }]));
      wsSpy.get.and.callFake(url => {
        if (url === '/staff/profile') {
          return of<StaffProfile[]>([
            {
              REFNO: 123,
              PHOTO: 'base64',
              ID: 'john.doe',
              FULLNAME: 'John Doe',
              DOB: date,
              NRIC: '000000-00-0000',
              PASSPORTNO: '0d013d10',
              NATIONALITY: 'Malaysian',
              TITLE: 'CXO',
              DEPARTMENT: 'APU',
              DEPARTMENT2: '',
              DEPARTMENT3: '',
              CURRENT_JOB_TYPE: 'CXO',
              EMAIL: 'john.doe@staffmail.apu.edu.my',
              DID: '',
              EXTENSION: '0',
              CODE: 'DOE'
            }
          ]) as any;
        } else if (url === '/attendix/classcodes') {
          return of<Classcode[]>([
            {
              CLASS_CODE: classcode,
              CLASSES: [{
                DATE: date,
                TIME_FROM: startTime,
                TIME_TO: endTime,
                TYPE: classType
              }],
              COURSE_CODE_ALIAS: 'XXX',
              LECTURER_CODE: 'DOE',
              SUBJECT_CODE: 'XXX'
            }
          ]);
        } else {
          fail(url);
        }
      });

      fixture = TestBed.createComponent(ClassesPage);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(ttSpy.get).toHaveBeenCalledTimes(1);
      expect(wsSpy.get).toHaveBeenCalledTimes(2);
      expect(wsSpy.get).toHaveBeenCalledWith('/staff/profile', { caching: 'cache-only' });
      expect(wsSpy.get).toHaveBeenCalledWith('/attendix/classcodes');

      expect(component.classcode).toEqual(classcode);
      expect(component.date).toEqual(date);
      expect(component.startTime).toEqual(startTime);
      expect(component.endTime).toEqual(endTime);
      expect(component.classType).toEqual(classType);
      expect(component.auto).toBeTrue();

      const markEl = fixture.nativeElement.querySelector('ion-grid > ion-row > ion-col > ion-button');
      expect(markEl.disabled).toBeFalse();
      markEl.click();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/attendix/mark-attendance',
        { classcode, date, startTime, endTime, classType }]);
      expect(wsSpy.post).not.toHaveBeenCalled();
    });
  });
});

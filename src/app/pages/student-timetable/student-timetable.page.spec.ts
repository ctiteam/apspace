import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, NEVER } from 'rxjs';

import { ActivatedRouteStub, RouterLinkDirectiveStub } from '../../../testing';
import {
  SettingsService, StudentTimetableService, UserSettingsService, WsApiService
} from '../../services';
import { ClassesPipe } from './classes.pipe';
import { GenPipe } from './gen.pipe';
import { StudentTimetablePage } from './student-timetable.page';
import { ThedayPipe } from './theday.pipe';
import { TheWeekPipe } from './theweek.pipe';

describe('StudentTimetablePage', () => {
  let activatedRoute: ActivatedRouteStub;
  let component: StudentTimetablePage;
  let fixture: ComponentFixture<StudentTimetablePage>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;
  let studentTimetableSpy: jasmine.SpyObj<StudentTimetableService>;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get']);
    studentTimetableSpy = jasmine.createSpyObj('StudentTimetableService', ['get']);
    const userSettingsServiceStub = { timetable: new BehaviorSubject({ blacklists: [] }) };

    TestBed.configureTestingModule({
      declarations: [
        ClassesPipe,
        GenPipe,
        RouterLinkDirectiveStub,
        StudentTimetablePage,
        TheWeekPipe,
        ThedayPipe,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ModalController, useValue: {} },
        { provide: Router, useValue: { url: '/' } },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: StudentTimetableService, useValue: studentTimetableSpy },
        { provide: UserSettingsService, useValue: userSettingsServiceStub },
        { provide: WsApiService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create', () => {
    activatedRoute.setParams({});
    studentTimetableSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(StudentTimetablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});

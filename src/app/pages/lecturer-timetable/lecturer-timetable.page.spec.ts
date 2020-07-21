import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NEVER } from 'rxjs';

import { RouterLinkDirectiveStub } from '../../../testing';
import { SettingsService, WsApiService } from '../../services';
import { EndtimePipe } from './endtime.pipe';
import { LecturerTimetablePage } from './lecturer-timetable.page';
import { ThedayPipe } from './theday.pipe';
import { TheweekPipe } from './theweek.pipe';

describe('LecturerTimetablePage', () => {
  let component: LecturerTimetablePage;
  let fixture: ComponentFixture<LecturerTimetablePage>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get']);
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [
        RouterLinkDirectiveStub,
        LecturerTimetablePage,
        ThedayPipe,
        TheweekPipe,
        EndtimePipe,
      ],
      providers: [
        { provide: Router, useValue: { url: '/' } },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: WsApiService, useValue: wsSpy },
        { provide: InAppBrowser, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(LecturerTimetablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NEVER } from 'rxjs';

import { WsApiService } from '../../services';
import { LecturerTimetablePage } from './lecturer-timetable.page';

describe('LecturerTimetablePage', () => {
  let component: LecturerTimetablePage;
  let fixture: ComponentFixture<LecturerTimetablePage>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [LecturerTimetablePage],
      providers: [
        { provide: WsApiService, useValue: wsSpy },
        { provide: Router, useValue: { url: '/' } },
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

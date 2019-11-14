import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { LecturerTimetablePage } from './lecturer-timetable.page';

describe('LecturerTimetablePage', () => {
  let component: LecturerTimetablePage;
  let fixture: ComponentFixture<LecturerTimetablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturerTimetablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerTimetablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

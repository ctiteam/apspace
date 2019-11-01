import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerTimetableComponent } from './lecturer-timetable.component';

describe('LecturerTimetableComponent', () => {
  let component: LecturerTimetableComponent;
  let fixture: ComponentFixture<LecturerTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LecturerTimetableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

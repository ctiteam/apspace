import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSchedulePage } from './exam-schedule.page';

describe('ExamSchedulePage', () => {
  let component: ExamSchedulePage;
  let fixture: ComponentFixture<ExamSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSchedulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { StudentSurveyPage } from './student-survey.page';

describe('StudentSurveyPage', () => {
  let component: StudentSurveyPage;
  let fixture: ComponentFixture<StudentSurveyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSurveyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

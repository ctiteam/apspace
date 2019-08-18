import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSurveyPage } from './submit-survey.page';

describe('SubmitSurveyPage', () => {
  let component: SubmitSurveyPage;
  let fixture: ComponentFixture<SubmitSurveyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitSurveyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProgressReportPage } from './update-progress-report.page';

describe('UpdateProgressReportPage', () => {
  let component: UpdateProgressReportPage;
  let fixture: ComponentFixture<UpdateProgressReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateProgressReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProgressReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

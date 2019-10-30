import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilingReportPage } from './filing-report.page';

describe('FilingReportPage', () => {
  let component: FilingReportPage;
  let fixture: ComponentFixture<FilingReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilingReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilingReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

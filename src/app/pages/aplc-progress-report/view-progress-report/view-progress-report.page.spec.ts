import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ViewProgressReportPage } from './view-progress-report.page';

describe('ViewProgressReportPage', () => {
  let component: ViewProgressReportPage;
  let fixture: ComponentFixture<ViewProgressReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProgressReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProgressReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

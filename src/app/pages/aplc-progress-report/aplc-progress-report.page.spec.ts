import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { AplcProgressReportPage } from './aplc-progress-report.page';

describe('AplcProgressReportPage', () => {
  let component: AplcProgressReportPage;
  let fixture: ComponentFixture<AplcProgressReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AplcProgressReportPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplcProgressReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

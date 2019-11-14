import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { WsApiService } from '../../services';
import { FilingReportPage } from './filing-report.page';

describe('FilingReportPage', () => {
  let component: FilingReportPage;
  let fixture: ComponentFixture<FilingReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilingReportPage],
      providers: [
        { provide: WsApiService, useValue: {} },
      ],
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

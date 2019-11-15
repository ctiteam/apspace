import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { WsApiService } from '../../../services';
import { UpdateProgressReportPage } from './update-progress-report.page';

describe('UpdateProgressReportPage', () => {
  let component: UpdateProgressReportPage;
  let fixture: ComponentFixture<UpdateProgressReportPage>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [UpdateProgressReportPage],
      providers: [
        { provide: WsApiService, useValue: wsSpy },
      ],
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

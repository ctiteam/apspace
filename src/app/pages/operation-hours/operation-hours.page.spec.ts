import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { WsApiService } from '../../services';
import { FilterByCompanyPipe } from './filter-by-company.pipe';
import { OperationHoursPage } from './operation-hours.page';
import { TimePipe } from './time.pipe';

describe('OperationHoursPage', () => {
  let component: OperationHoursPage;
  let fixture: ComponentFixture<OperationHoursPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OperationHoursPage, TimePipe, FilterByCompanyPipe],
      providers: [
        { provide: WsApiService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationHoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

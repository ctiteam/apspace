import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ChartModule } from 'angular2-chartjs';
import { NEVER } from 'rxjs';

import { WsApiService } from '../../services';
import { HrPage } from './hr.page';
import { SortByDatePipe } from './sort-by-date.pipe';

describe('HrPage', () => {
  let component: HrPage;
  let fixture: ComponentFixture<HrPage>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);
    TestBed.configureTestingModule({
      declarations: [HrPage, SortByDatePipe],
      providers: [
        { provide: WsApiService, useValue: wsSpy },
      ],
      imports: [ChartModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    wsSpy.get.and.returnValue(NEVER);
    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

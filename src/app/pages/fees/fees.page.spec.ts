import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ChartComponent } from 'angular2-chartjs';

import { WsApiService } from '../../services';
import { ReversePipe } from '../../shared/reverse/reverse.pipe';
import { FeesPage } from './fees.page';
import { FilterPipe } from './filter.pipe';

describe('FeesPage', () => {
  let component: FeesPage;
  let fixture: ComponentFixture<FeesPage>;

  beforeEach(async(() => {
    const ws = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [FeesPage, ChartComponent, FilterPipe, ReversePipe],
      providers: [
        { provide: WsApiService, useValue: ws }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

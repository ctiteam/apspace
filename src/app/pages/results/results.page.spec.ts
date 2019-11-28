import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { ChartModule } from 'angular2-chartjs';

import { WsApiService } from '../../services';
import { ResultsPage } from './results.page';

describe('ResultsPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsPage ],
      providers: [
        { provide: NavController, useValue: {} },
        { provide: WsApiService, useValue: {} },
      ],
      imports: [ChartModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

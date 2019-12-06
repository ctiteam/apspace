import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SettingsService, WsApiService } from '../../services';
import { BusShuttleServicesPage } from './bus-shuttle-services.page';

describe('BusShuttleServicesPage', () => {
  let component: BusShuttleServicesPage;
  let fixture: ComponentFixture<BusShuttleServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusShuttleServicesPage],
      providers: [
        { provide: Router, useValue: { url: '/' } },
        { provide: SettingsService, useValue: {} },
        { provide: WsApiService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusShuttleServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

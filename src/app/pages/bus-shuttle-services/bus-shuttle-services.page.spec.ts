import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusShuttleServicesPage } from './bus-shuttle-services.page';

describe('BusTrackingPage', () => {
  let component: BusShuttleServicesPage;
  let fixture: ComponentFixture<BusShuttleServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusShuttleServicesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
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

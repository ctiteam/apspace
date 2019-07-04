import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusShuttleService } from './bus-shuttle-services.page';

describe('BusTrackingPage', () => {
  let component: BusShuttleService;
  let fixture: ComponentFixture<BusShuttleService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusShuttleService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusShuttleService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

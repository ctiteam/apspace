import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusShuttlePage } from './bus-shuttle-services.page';

describe('BusTrackingPage', () => {
  let component: BusShuttlePage;
  let fixture: ComponentFixture<BusShuttlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusShuttlePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusShuttlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

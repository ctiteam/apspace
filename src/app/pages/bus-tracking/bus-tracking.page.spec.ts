import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusTrackingPage } from './bus-tracking.page';

describe('BusTrackingPage', () => {
  let component: BusTrackingPage;
  let fixture: ComponentFixture<BusTrackingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusTrackingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusTrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

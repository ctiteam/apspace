import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnavailabilityPage } from './add-unavailability.page';

describe('AddUnavailabilityPage', () => {
  let component: AddUnavailabilityPage;
  let fixture: ComponentFixture<AddUnavailabilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUnavailabilityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnavailabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

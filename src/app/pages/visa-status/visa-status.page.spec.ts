import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaStatusPage } from './visa-status.page';

describe('VisaStatusPage', () => {
  let component: VisaStatusPage;
  let fixture: ComponentFixture<VisaStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

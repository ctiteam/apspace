import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { GraduateVerificationServicePage } from './graduate-verification-service.page';

describe('GraduateVerificationServicePage', () => {
  let component: GraduateVerificationServicePage;
  let fixture: ComponentFixture<GraduateVerificationServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduateVerificationServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduateVerificationServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

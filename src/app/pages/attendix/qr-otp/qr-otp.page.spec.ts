import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrOtpPage } from './qr-otp.page';

describe('QrOtpPage', () => {
  let component: QrOtpPage;
  let fixture: ComponentFixture<QrOtpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QrOtpPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseOtpComponent } from './use-otp.component';

describe('UseOtpComponent', () => {
  let component: UseOtpComponent;
  let fixture: ComponentFixture<UseOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

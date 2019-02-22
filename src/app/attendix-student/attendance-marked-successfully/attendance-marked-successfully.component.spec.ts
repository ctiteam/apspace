import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceMarkedSuccessfullyComponent } from './attendance-marked-successfully.component';

describe('AttendanceMarkedSuccessfullyComponent', () => {
  let component: AttendanceMarkedSuccessfullyComponent;
  let fixture: ComponentFixture<AttendanceMarkedSuccessfullyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceMarkedSuccessfullyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceMarkedSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

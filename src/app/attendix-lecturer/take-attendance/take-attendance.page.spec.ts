import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeAttendancePage } from './take-attendance.page';

describe('TakeAttendancePage', () => {
  let component: TakeAttendancePage;
  let fixture: ComponentFixture<TakeAttendancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeAttendancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAttendancePage } from './update-attendance.page';

describe('UpdateAttendancePage', () => {
  let component: UpdateAttendancePage;
  let fixture: ComponentFixture<UpdateAttendancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAttendancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

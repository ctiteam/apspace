import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendixStudentPage } from './attendix-student.page';

describe('AttendixStudentPage', () => {
  let component: AttendixStudentPage;
  let fixture: ComponentFixture<AttendixStudentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendixStudentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendixStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

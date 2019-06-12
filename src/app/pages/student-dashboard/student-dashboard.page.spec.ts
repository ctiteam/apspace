import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDashboardPage } from './student-dashboard.page';

describe('StudentDashboardPage', () => {
  let component: StudentDashboardPage;
  let fixture: ComponentFixture<StudentDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDashboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

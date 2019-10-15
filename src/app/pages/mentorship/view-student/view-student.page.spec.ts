import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStudentPage } from './view-student.page';

describe('ViewStudentPage', () => {
  let component: ViewStudentPage;
  let fixture: ComponentFixture<ViewStudentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStudentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveStudentPage } from './remove-student.page';

describe('RemoveStudentPage', () => {
  let component: RemoveStudentPage;
  let fixture: ComponentFixture<RemoveStudentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveStudentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomFinderPage } from './classroom-finder.page';

describe('ClassroomFinderPage', () => {
  let component: ClassroomFinderPage;
  let fixture: ComponentFixture<ClassroomFinderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassroomFinderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassroomFinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

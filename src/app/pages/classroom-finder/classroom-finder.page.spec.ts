import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { StudentTimetableService } from '../../services';
import { AtPipe } from './at.pipe';
import { ClassroomFinderPage } from './classroom-finder.page';
import { ForPipe } from './for.pipe';
import { OnPipe } from './on.pipe';

describe('ClassroomFinderPage', () => {
  let component: ClassroomFinderPage;
  let fixture: ComponentFixture<ClassroomFinderPage>;
  let ttSpy: jasmine.SpyObj<StudentTimetableService>;

  beforeEach(async(() => {
    ttSpy = jasmine.createSpyObj('StudentTimetableService', ['get']);

    TestBed.configureTestingModule({
      declarations: [ClassroomFinderPage, AtPipe, ForPipe, OnPipe],
      providers: [
        { provide: StudentTimetableService, useValue: ttSpy },
      ],
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

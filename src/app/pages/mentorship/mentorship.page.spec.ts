import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MentorshipService } from 'src/app/services/mentorship.service';
import { MentorshipPage } from './mentorship.page';
import { FilterPipe } from './pipes/filter.pipe';
import { SearchPipe } from './pipes/search.pipe';

describe('MentorshipPage', () => {
  let component: MentorshipPage;
  let fixture: ComponentFixture<MentorshipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MentorshipPage, FilterPipe, SearchPipe],
      providers: [
        { provide: MentorshipService, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorshipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

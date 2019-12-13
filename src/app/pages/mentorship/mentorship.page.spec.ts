import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MentorshipPage } from './mentorship.page';

describe('MentorshipPage', () => {
  let component: MentorshipPage;
  let fixture: ComponentFixture<MentorshipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MentorshipPage ],
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

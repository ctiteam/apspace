import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { MentorshipService } from 'src/app/services/mentorship.service';
import { FilterPipe } from './pipes/filter.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { ViewStudentPage } from './view-student.page';

describe('ViewStudentPage', () => {
  let component: ViewStudentPage;
  let fixture: ComponentFixture<ViewStudentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStudentPage, ReversePipe, FilterPipe, SearchPipe ],
      providers: [
        { provide: MentorshipService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: ModalController, useValue: {} }
      ],
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

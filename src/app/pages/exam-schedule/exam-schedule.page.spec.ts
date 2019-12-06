import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { IntakeListingService, SettingsService, WsApiService } from '../../services';
import { ExamSchedulePage } from './exam-schedule.page';

describe('ExamSchedulePage', () => {
  let component: ExamSchedulePage;
  let fixture: ComponentFixture<ExamSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExamSchedulePage],
      providers: [
        { provide: IntakeListingService, useValue: {} },
        { provide: ModalController, useValue: {} },
        { provide: SettingsService, useValue: {} },
        { provide: WsApiService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

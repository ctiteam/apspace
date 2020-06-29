import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamScheduleDetailsPage } from './exam-schedule-details.page';

describe('ExamScheduleDetailsPage', () => {
  let component: ExamScheduleDetailsPage;
  let fixture: ComponentFixture<ExamScheduleDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamScheduleDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamScheduleDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

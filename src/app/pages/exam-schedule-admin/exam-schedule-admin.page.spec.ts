import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExamScheduleAdminPage } from './exam-schedule-admin.page';

describe('ExamScheduleAdminPage', () => {
  let component: ExamScheduleAdminPage;
  let fixture: ComponentFixture<ExamScheduleAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamScheduleAdminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamScheduleAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

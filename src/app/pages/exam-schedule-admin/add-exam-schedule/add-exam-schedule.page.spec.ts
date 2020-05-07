import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddExamSchedulePage } from './add-exam-schedule.page';

describe('AddExamSchedulePage', () => {
  let component: AddExamSchedulePage;
  let fixture: ComponentFixture<AddExamSchedulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExamSchedulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddExamSchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

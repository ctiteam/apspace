import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarkAttendancePage } from './mark-attendance.page';

describe('MarkAttendancePage', () => {
  let component: MarkAttendancePage;
  let fixture: ComponentFixture<MarkAttendancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAttendancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

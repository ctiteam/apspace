import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarkAttendanceNewPage } from './mark-attendance-new.page';

describe('MarkAttendanceNewPage', () => {
  let component: MarkAttendanceNewPage;
  let fixture: ComponentFixture<MarkAttendanceNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAttendanceNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkAttendanceNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

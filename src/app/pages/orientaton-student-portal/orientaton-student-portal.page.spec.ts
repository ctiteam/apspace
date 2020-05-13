import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrientatonStudentPortalPage } from './orientaton-student-portal.page';

describe('OrientatonStudentPortalPage', () => {
  let component: OrientatonStudentPortalPage;
  let fixture: ComponentFixture<OrientatonStudentPortalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrientatonStudentPortalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrientatonStudentPortalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

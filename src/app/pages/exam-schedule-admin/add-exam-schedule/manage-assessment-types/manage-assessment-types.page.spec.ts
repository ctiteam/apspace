import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageAssessmentTypesPage } from './manage-assessment-types.page';

describe('ManageAssessmentTypesPage', () => {
  let component: ManageAssessmentTypesPage;
  let fixture: ComponentFixture<ManageAssessmentTypesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAssessmentTypesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAssessmentTypesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

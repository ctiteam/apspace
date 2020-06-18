import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CovidVisitorFormPage } from './covid-visitor-form.page';

describe('CovidVisitorFormPage', () => {
  let component: CovidVisitorFormPage;
  let fixture: ComponentFixture<CovidVisitorFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidVisitorFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CovidVisitorFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

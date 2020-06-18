import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CovidVisitorSessionPassPage } from './covid-visitor-session-pass.page';

describe('CovidVisitorSessionPassPage', () => {
  let component: CovidVisitorSessionPassPage;
  let fixture: ComponentFixture<CovidVisitorSessionPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidVisitorSessionPassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CovidVisitorSessionPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

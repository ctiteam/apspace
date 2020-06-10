import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCardComponent } from './form-card.component';

describe('FormCardComponent', () => {
  let component: FormCardComponent;
  let fixture: ComponentFixture<FormCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

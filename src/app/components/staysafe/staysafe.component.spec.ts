import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StaysafeComponent } from './staysafe.component';

describe('StaysafeComponent', () => {
  let component: StaysafeComponent;
  let fixture: ComponentFixture<StaysafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaysafeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StaysafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShakespearModalPage } from './shakespear-modal.page';

describe('ShakespearModalPage', () => {
  let component: ShakespearModalPage;
  let fixture: ComponentFixture<ShakespearModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShakespearModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShakespearModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

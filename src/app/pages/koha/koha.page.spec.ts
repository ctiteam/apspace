import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KohaPage } from './koha.page';

describe('KohaPage', () => {
  let component: KohaPage;
  let fixture: ComponentFixture<KohaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KohaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KohaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

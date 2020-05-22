import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddIntakePage } from './add-intake.page';

describe('AddIntakePage', () => {
  let component: AddIntakePage;
  let fixture: ComponentFixture<AddIntakePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIntakePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddIntakePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

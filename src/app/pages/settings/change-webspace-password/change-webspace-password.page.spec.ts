import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeWebspacePasswordPage } from './change-webspace-password.page';

describe('ChangeWebspacePasswordPage', () => {
  let component: ChangeWebspacePasswordPage;
  let fixture: ComponentFixture<ChangeWebspacePasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeWebspacePasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeWebspacePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

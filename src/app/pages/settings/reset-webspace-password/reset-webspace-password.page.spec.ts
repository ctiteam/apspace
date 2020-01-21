import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResetWebspacePasswordPage } from './reset-webspace-password.page';

describe('ResetWebspacePasswordPage', () => {
  let component: ResetWebspacePasswordPage;
  let fixture: ComponentFixture<ResetWebspacePasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetWebspacePasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetWebspacePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

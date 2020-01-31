import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { NEVER } from 'rxjs';

import { WebspacePasswordService } from 'src/app/services/webspace-password.service';
import { ChangeWebspacePasswordPage } from './change-webspace-password.page';

describe('ChangeWebspacePasswordPage', () => {
  let component: ChangeWebspacePasswordPage;
  let fixture: ComponentFixture<ChangeWebspacePasswordPage>;
  let webspacePasswordSpy: jasmine.SpyObj<WebspacePasswordService>;

  beforeEach(async(() => {
    webspacePasswordSpy = jasmine.createSpyObj('WebspacePasswordService', ['changePassword']);
    TestBed.configureTestingModule({
      declarations: [ChangeWebspacePasswordPage],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        IonicModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        { provide: WebspacePasswordService, useValue: webspacePasswordSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create', () => {
    webspacePasswordSpy.changePassword.and.returnValue(NEVER);

    fixture = TestBed.createComponent(ChangeWebspacePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { NEVER } from 'rxjs';

import { SettingsService, WsApiService } from 'src/app/services';
import { WebspacePasswordService } from 'src/app/services/webspace-password.service';
import { ResetWebspacePasswordPage } from './reset-webspace-password.page';

describe('ResetWebspacePasswordPage', () => {
  let component: ResetWebspacePasswordPage;
  let fixture: ComponentFixture<ResetWebspacePasswordPage>;
  let webspacePasswordSpy: jasmine.SpyObj<WebspacePasswordService>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async(() => {
    webspacePasswordSpy = jasmine.createSpyObj('WebspacePasswordService', ['resetPassword']);
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get', 'ready']);
    TestBed.configureTestingModule({
      declarations: [ResetWebspacePasswordPage],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        IonicModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        { provide: WebspacePasswordService, useValue: webspacePasswordSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: WsApiService, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create', () => {
    webspacePasswordSpy.resetPassword.and.returnValue(NEVER);
    settingsSpy.ready.and.returnValue(Promise.resolve());

    fixture = TestBed.createComponent(ResetWebspacePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

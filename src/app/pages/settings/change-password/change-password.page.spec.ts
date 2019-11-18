import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { NEVER } from 'rxjs';

import {
  CasTicketService, ChangePasswordService, SettingsService, WsApiService
} from '../../../services';
import { ChangePasswordPage } from './change-password.page';

describe('ChangePasswordPage', () => {
  let component: ChangePasswordPage;
  let fixture: ComponentFixture<ChangePasswordPage>;
  let settingsSpy: jasmine.SpyObj<SettingsService>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get']);
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [ChangePasswordPage],
      providers: [
        { provide: ChangePasswordService, useValue: {} },
        { provide: CasTicketService, useValue: {} },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: WsApiService, useValue: wsSpy },
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule, IonicModule],
    }).compileComponents();
  }));

  it('should create', () => {
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(ChangePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});

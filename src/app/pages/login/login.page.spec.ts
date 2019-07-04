import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';

import { of } from 'rxjs';

import { LoginPage } from './login.page';
import { CasTicketService, SettingsService, WsApiService } from '../../services';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let getSpy: jasmine.Spy;

  beforeEach(async(() => {
    const settingsService = jasmine.createSpyObj('SettingsService', ['get']);
    getSpy = settingsService.get.and.returnValue(Promise.resolve(null));

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginPage],
      providers: [
        { provide: CasTicketService, useValue: {} },
        { provide: WsApiService, useValue: {} },
        { provide: Network, useValue: {} },
        { provide: Router, useValue: {} },
        // { provide: Storage, useValue: storage },
        { provide: SettingsService, useValue: settingsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should retrieve tgt', () => {
  //   // TODO: add click
  //   expect(getSpy).toHaveBeenCalledWith(['tgt']);
  // });
});

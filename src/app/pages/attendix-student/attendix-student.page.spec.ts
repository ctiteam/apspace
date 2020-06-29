import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import {
  ApolloTestingController, ApolloTestingModule
} from 'apollo-angular/testing';

import { Vibration } from '@ionic-native/vibration/ngx';
import { SettingsService } from '../../services';
import { AttendixStudentPage } from './attendix-student.page';

describe('AttendixStudentPage', () => {
  let component: AttendixStudentPage;
  let fixture: ComponentFixture<AttendixStudentPage>;
  let apollo: ApolloTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttendixStudentPage],
      providers: [
        { provide: QRScanner, useValue: {} },
        { provide: Vibration, useValue: {} },
        { provide: SettingsService, useValue: {} },
      ],
      imports: [ApolloTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    apollo = TestBed.inject(ApolloTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendixStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    apollo.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

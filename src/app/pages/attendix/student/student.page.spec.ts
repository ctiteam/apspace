import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import {
  ApolloTestingController, ApolloTestingModule
} from 'apollo-angular/testing';

import { SettingsService } from '../../../services';
import { StudentPage } from './student.page';

describe('StudentPage', () => {
  let component: StudentPage;
  let fixture: ComponentFixture<StudentPage>;
  let apollo: ApolloTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudentPage],
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
    fixture = TestBed.createComponent(StudentPage);
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

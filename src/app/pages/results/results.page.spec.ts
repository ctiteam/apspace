import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { ChartModule } from 'angular2-chartjs';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { WsApiService } from '../../services';
import { ResultsPage } from './results.page';

describe('ResultsPage', () => {
  let component: ResultsPage;
  let fixture: ComponentFixture<ResultsPage>;
  let storage = jasmine.createSpyObj('Storage', ['get']);

  beforeEach(async(() => {
    storage = jasmine.createSpyObj('Storage', ['get']);
    TestBed.configureTestingModule({
      declarations: [ ResultsPage ],
      providers: [
        { provide: NavController, useValue: {} },
        { provide: WsApiService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: Storage, useValue: storage },
        { provide: Router, useValue: {} },
        { provide: InAppBrowser, useValue: {} }
      ],
      imports: [ChartModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    storage.get.and.callFake(() => Promise.resolve(null));
    fixture = TestBed.createComponent(ResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

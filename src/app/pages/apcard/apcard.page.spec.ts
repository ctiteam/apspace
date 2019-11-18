import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';

import { WsApiService } from 'src/app/services';
import { ApcardPage } from './apcard.page';

describe('ApcardPage', () => {
  let component: ApcardPage;
  let fixture: ComponentFixture<ApcardPage>;

  beforeEach(async(() => {
    const ws = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [ApcardPage],
      providers: [
        { provide: Router, useValue: { url: '/' } },
        { provide: WsApiService, useValue: ws }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApcardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

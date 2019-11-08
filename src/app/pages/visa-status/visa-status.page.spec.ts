import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER } from 'rxjs';

import { SettingsService, WsApiService } from '../../services';
import { VisaStatusPage } from './visa-status.page';

describe('VisaStatusPage', () => {
  let component: VisaStatusPage;
  let fixture: ComponentFixture<VisaStatusPage>;
  let settings: { get: jasmine.Spy };
  let ws: { get: jasmine.Spy };

  beforeEach(async(() => {
    settings = jasmine.createSpyObj('SettingsService', ['get']);
    ws = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [ VisaStatusPage ],
      providers: [
        { provide: SettingsService, useValue: settings },
        { provide: WsApiService, useValue: ws },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  it('should create', () => {
    ws.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(VisaStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(ws.get).toHaveBeenCalledTimes(1);
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NEVER } from 'rxjs';

import { WsApiService } from 'src/app/services';
import { ReversePipe } from '../../shared/reverse/reverse.pipe';
import { AttendancePage } from './attendance.page';

describe('AttendancePage', () => {
  let component: AttendancePage;
  let fixture: ComponentFixture<AttendancePage>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(async(() => {
    wsSpy = jasmine.createSpyObj('WsApiService', ['get']);

    TestBed.configureTestingModule({
      declarations: [AttendancePage, ReversePipe],
      providers: [
        { provide: Router, useValue: { url: '/' } },
        { provide: WsApiService, useValue: wsSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    wsSpy.get.and.returnValue(NEVER);

    fixture = TestBed.createComponent(AttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});

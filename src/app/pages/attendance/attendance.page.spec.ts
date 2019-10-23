import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsApiService } from 'src/app/services';
import { AttendancePage } from './attendance.page';

describe('AttendancePage', () => {
  let component: AttendancePage;
  let fixture: ComponentFixture<AttendancePage>;

  beforeEach(async(() => {
    const ws = jasmine.createSpyObj('WsApiService', []);

    TestBed.configureTestingModule({
      declarations: [AttendancePage],
      providers: [
        { provide: WsApiService, useValue: ws }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { NEVER } from 'rxjs';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { RouterLinkDirectiveStub } from '../../../testing';
import { WsApiService } from '../../services';
import { FromWeekPipe } from './from-week.pipe';
import { LecturerTimetableComponent } from './lecturer-timetable.component';
import { LengthPipe } from './length.pipe';
import { ReversePipe } from './reverse.pipe';

describe('LecturerTimetableComponent', () => {
  let getSpy: jasmine.Spy;

  beforeEach(async(() => {
    const ws = jasmine.createSpyObj('WsApiService', ['get']);
    getSpy = ws.get;
    TestBed.configureTestingModule({
      declarations: [
        FromWeekPipe,
        LecturerTimetableComponent,
        LengthPipe,
        ReversePipe,
        RouterLinkDirectiveStub,
      ],
      providers: [
        { provide: WsApiService, useValue: ws },
<<<<<<< HEAD
        { provide: InAppBrowser, useValue: {} },
=======
        { provide: InAppBrowser, useValue: {} }
>>>>>>> test(lecturer-timetable): fix test
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create', () => {
    getSpy.and.returnValue(NEVER);

    const fixture = TestBed.createComponent(LecturerTimetableComponent);
    const component = fixture.componentInstance;
    component.id = '1';
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(getSpy).toHaveBeenCalledTimes(1);
  });
});

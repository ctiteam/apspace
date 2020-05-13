import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture, TestBed, async, discardPeriodicTasks, fakeAsync, tick
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import {
  ApolloTestingController, ApolloTestingModule
} from 'apollo-angular/testing';
import { GraphQLError } from 'graphql';

import {
  AttendanceDocument, InitAttendanceDocument, NewStatusDocument
} from '../../../../generated/graphql';
import { ActivatedRouteStub } from '../../../../testing';
import { AttendancePipe } from './attendance.pipe';
import { CharsPipe } from './chars.pipe';
import { MarkAttendancePage } from './mark-attendance.page';
import { SearchPipe } from './search.pipe';

describe('MarkAttendancePage', () => {
  let component: MarkAttendancePage;
  let fixture: ComponentFixture<MarkAttendancePage>;
  let apollo: ApolloTestingController;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [
        MarkAttendancePage,
        QRCodeComponent,
        AttendancePipe,
        CharsPipe,
        SearchPipe,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Location, useValue: {} },
      ],
      imports: [ApolloTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    apollo = TestBed.get(ApolloTestingController);
  }));

  afterEach(() => {
    apollo.verify();
  });

  describe('current class', () => {
    beforeEach(() => {
      activatedRoute.setParamMap({
        classcode: 'classcode',
        date: '2019-01-01',
        startTime: '08:30 AM',
        endTime: '10:30 AM',
        classType: 'Lecture'
      });
      jasmine.clock().mockDate(new Date('2019-01-01T09:00:00+08:00'));

      fixture = TestBed.createComponent(MarkAttendancePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should only request init attendance', fakeAsync(() => {
      const op = apollo.expectOne(InitAttendanceDocument);
      op.flush({
        data: {
          attendance: {
            secret: 'aoeuaoeuaoeuaoeu',
            students: []
          }
        }
      });
      apollo.expectNone(AttendanceDocument);

      tick();
      fixture.detectChanges();
      apollo.expectOne(NewStatusDocument);

      discardPeriodicTasks(); // countdown timer

      expect(component).toBeTruthy();
      expect(component.auto).toEqual(true);
    }));

    it('should request init attendance and attendance', fakeAsync(() => {
      apollo.expectOne(InitAttendanceDocument).graphqlErrors([new GraphQLError('Class exist')]);
      tick();
      const op = apollo.expectOne(AttendanceDocument);
      op.flush({
        data: {
          attendance: {
            secret: 'aoeuaoeuaoeuaoeu',
            students: [],
            log: null
          }
        }
      });

      tick();
      fixture.detectChanges();
      apollo.expectOne(NewStatusDocument);

      discardPeriodicTasks(); // countdown timer

      expect(component).toBeTruthy();
      expect(component.auto).toEqual(false);
    }));
  });

  describe('previous class', () => {
    beforeEach(() => {
      activatedRoute.setParamMap({
        classcode: 'classcode',
        date: '2019-01-01',
        startTime: '08:30 AM',
        endTime: '10:30 AM',
        classType: 'Lecture'
      });
      jasmine.clock().mockDate(new Date('2019-01-01T08:00:00+08:00'));

      fixture = TestBed.createComponent(MarkAttendancePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should only request attendance', fakeAsync(() => {
      const op = apollo.expectOne(AttendanceDocument);
      op.flush({
        data: {
          attendance: {
            secret: 'aoeuaoeuaoeuaoeu',
            students: [],
            log: null
          }
        }
      });

      tick();
      apollo.expectNone(InitAttendanceDocument);
      apollo.expectOne(NewStatusDocument);

      expect(component).toBeTruthy();
      expect(component.auto).toEqual(false);
    }));

    it('should request attendance and init attendance', fakeAsync(() => {
      apollo.expectOne(AttendanceDocument).graphqlErrors([new GraphQLError('Attendance not initialized')]);
      tick();
      const op = apollo.expectOne(InitAttendanceDocument);
      op.flush({
        data: {
          attendance: {
            secret: 'aoeuaoeuaoeuaoeu',
            students: [],
            log: null
          }
        }
      });

      tick();
      fixture.detectChanges();
      apollo.expectOne(NewStatusDocument);

      expect(component).toBeTruthy();
      expect(component.auto).toEqual(false);
    }));
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import {
  ApolloTestingController, ApolloTestingModule
} from 'apollo-angular/testing';
import { GraphQLError } from 'graphql';

import { AttendanceDocument, InitAttendanceDocument } from '../../../../generated/graphql';
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

  beforeEach(() => {
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
      ],
      imports: [ApolloTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    apollo = TestBed.get(ApolloTestingController);
    activatedRoute.setParams({
      classcode: 'classcode',
      date: '2019-01-01',
      startTime: '08:30 AM',
      endTime: '10:30 AM',
      classType: 'Lecture'
    });
    fixture = TestBed.createComponent(MarkAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    apollo.verify();
  });

  it('should only request init attendance', () => {
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

    expect(component).toBeTruthy();
  });

  xit('should request init attendance and attendance', () => {
    apollo.expectOne(InitAttendanceDocument).graphqlErrors([new GraphQLError('Class exist')]);
    // TODO: not sure why it does not accept the second document
    const op = apollo.expectOne(AttendanceDocument);
    op.flush({
      data: {
        attendance: {
          secret: 'aoeuaoeuaoeuaoeu',
          students: []
        }
      }
    });

    expect(component).toBeTruthy();
  });
});

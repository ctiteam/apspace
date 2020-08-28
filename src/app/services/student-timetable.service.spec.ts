import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { StudentTimetableService } from './student-timetable.service';

describe('StudentTimetableService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: StudentTimetableService = TestBed.inject(StudentTimetableService);
    expect(service).toBeTruthy();
  });

  it('should refresh when empty', () => {
    const testData = [];
    const service: StudentTimetableService = TestBed.inject(StudentTimetableService);

    service.get(false).subscribe(
      data => expect(data).toEqual(testData),
      fail
    );

    // first request is expected to be cached
    const req1 = httpTestingController.expectOne(service.timetableUrl);
    expect(req1.request.method).toEqual('GET');
    expect(req1.request.headers.has('x-refresh')).toBeFalse();
    req1.flush(testData);

    const req2 = httpTestingController.expectOne(service.timetableUrl);
    expect(req2.request.method).toEqual('GET');
    expect(req2.request.headers.has('x-refresh')).toBeTrue();
    req2.flush(testData);
  });

  it('should considered outdated since current Sunday', () => {
    jasmine.clock().mockDate(new Date('2020-08-30'));
    const testData = [
      {
        INTAKE: '',
        MODID: '',
        DAY: '',
        GROUPING: '',
        LOCATION: '',
        ROOM: '',
        LECTID: '',
        NAME: '',
        SAMACCOUNTNAME: '',
        DATESTAMP: '',
        DATESTAMP_ISO: '2020-08-28',
        TIME_FROM: '',
        TIME_TO: '',
      }
    ];
    const service: StudentTimetableService = TestBed.inject(StudentTimetableService);

    service.get(false).subscribe(
      data => expect(data).toEqual(testData),
    );

    // first request is expected to be cached
    const req1 = httpTestingController.expectOne(service.timetableUrl);
    expect(req1.request.method).toEqual('GET');
    expect(req1.request.headers.has('x-refresh')).toBeFalse();
    req1.flush(testData);

    const req2 = httpTestingController.expectOne(service.timetableUrl);
    expect(req2.request.method).toEqual('GET');
    expect(req2.request.headers.has('x-refresh')).toBeTrue();
    req2.flush(testData);
  });

  it('should considered fresh while still Saturday', () => {
    jasmine.clock().mockDate(new Date('2020-08-29'));
    const testData = [
      {
        INTAKE: '',
        MODID: '',
        DAY: '',
        GROUPING: '',
        LOCATION: '',
        ROOM: '',
        LECTID: '',
        NAME: '',
        SAMACCOUNTNAME: '',
        DATESTAMP: '',
        DATESTAMP_ISO: '2020-08-28',
        TIME_FROM: '',
        TIME_TO: '',
      }
    ];
    const service: StudentTimetableService = TestBed.inject(StudentTimetableService);

    service.get(false).subscribe(
      data => expect(data).toEqual(testData),
    );

    // first request is expected to be cached
    const req1 = httpTestingController.expectOne(service.timetableUrl);
    expect(req1.request.method).toEqual('GET');
    expect(req1.request.headers.has('x-refresh')).toBeFalse();
    req1.flush(testData);
  });
});

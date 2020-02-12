import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Network } from '@ionic-native/network/ngx';

import { StudentTimetableService } from './student-timetable.service';

describe('StudentTimetableService', () => {
  let httpTestingController: HttpTestingController;
  let networkSpy: jasmine.SpyObj<Network>;

  beforeEach(() => {
    networkSpy = { type: 'wifi' } as jasmine.SpyObj<Network>;

    TestBed.configureTestingModule({
      providers: [
        { provide: Network, useValue: networkSpy },
      ],
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

  it('should save to cache', () => {
    const testData = [];
    const service: StudentTimetableService = TestBed.inject(StudentTimetableService);

    service.get(false).subscribe(
      data => expect(data).toEqual(testData),
      fail
    );

    // first requset is expected to be cached
    const req1 = httpTestingController.expectOne(service.timetableUrl);
    expect(req1.request.method).toEqual('GET');
    expect(req1.request.headers.has('x-refresh')).toBeFalsy();
    req1.flush(testData);

    const req2 = httpTestingController.expectOne(service.timetableUrl);
    expect(req2.request.method).toEqual('GET');
    expect(req2.request.headers.has('x-refresh')).toBeTruthy();
    req2.flush(testData);
  });

  it('should calculate outdated correctly', () => {
    const testData = [
      {
        INTAKE: '',
        MODID: '',
        DAY: '',
        LOCATION: '',
        ROOM: '',
        LECTID: '',
        NAME: '',
        SAMACCOUNTNAME: '',
        DATESTAMP: '',
        DATESTAMP_ISO: '2019-01-01',
        TIME_FROM: '',
        TIME_TO: '',
      }
    ];
    const service: StudentTimetableService = TestBed.inject(StudentTimetableService);
    networkSpy.type = 'none';

    service.get(false).subscribe(
      data => expect(data).toEqual(testData),
    );

    // first requset is expected to be cached
    const req1 = httpTestingController.expectOne(service.timetableUrl);
    expect(req1.request.method).toEqual('GET');
    expect(req1.request.headers.has('x-refresh')).toBeFalsy();
    req1.flush(testData);

    const req2 = httpTestingController.expectOne(service.timetableUrl);
    expect(req2.request.method).toEqual('GET');
    expect(req2.request.headers.has('x-refresh')).toBeTruthy();
    req2.flush(testData);
  });
});

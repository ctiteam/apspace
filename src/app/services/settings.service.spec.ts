import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';

import { asyncData, asyncError } from '../../testing';
import { Role, Settings } from '../interfaces';
import { SettingsService } from './settings.service';
import { WsApiService } from './ws-api.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let wsSpy: jasmine.SpyObj<WsApiService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    wsSpy = jasmine.createSpyObj('WsApiService', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Network, useValue: { type: 'wifi' } },
        { provide: Storage, useValue: storageSpy },
        { provide: WsApiService, useValue: wsSpy },
      ]
    });
  });

  describe('first storage', () => {
    beforeEach(() => {
      storageSpy.get.and.returnValue(Promise.resolve(null));
      service = TestBed.inject(SettingsService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
      expect(storageSpy.get).toHaveBeenCalledTimes(1);
      return expectAsync(service.ready()).toBeResolved();
    });

    it('should have default data', () => {
      // smoke test some random default value
      expect(service.get('viewWeek')).toBeFalse();
      expect(service.get('shakeSensitivity')).toBe(40);
      service.get$('modulesBlacklist').subscribe(
        data => expect(data).toEqual([]),
        fail
      );
      expect(storageSpy.get).toHaveBeenCalledTimes(1);
      expect(storageSpy.set).not.toHaveBeenCalled();
      expect(wsSpy.put).not.toHaveBeenCalled();
    });

    it('should get multiple data', () => {
      const expected = [false, true, false, true, false];
      let n = 0;
      wsSpy.put.and.returnValue(asyncData('OK'));
      service.get$('scan').subscribe(
        data => expect(data).toEqual(expected[n++], `missing step ${n}`),
        fail,
        fail
      );
      for (const input of [true, false, false, true, false]) {
        service.set('scan', input);
      }
      expect(service.get('scan')).toBe(expected[n - 1]);
      expect(storageSpy.get).toHaveBeenCalledTimes(1);
      expect(storageSpy.set).toHaveBeenCalledTimes(n - 1);
      expect(wsSpy.put).toHaveBeenCalledTimes(2); // non-default data len (true)
    });

    it('should not sync if value remain', () => {
      wsSpy.put.and.returnValue(asyncData('OK'));
      service.set('scan', true);
      service.set('scan', false);
      expect(service.get('scan')).toBeFalse();
      expect(storageSpy.get).toHaveBeenCalledTimes(1);
      expect(storageSpy.set).toHaveBeenCalledTimes(2);
      expect(wsSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  it('#clear should complete existing subscriptions', done => {
    storageSpy.get.and.returnValue(Promise.resolve(null));
    wsSpy.put.and.returnValue(asyncData('OK'));
    service = TestBed.inject(SettingsService);
    service.set('scan', true);
    service.get$('scan').subscribe(
      data => expect(data).toBe(true),
      fail,
      done
    );
    service.clear();
    expect(service.get('scan')).toBe(false, 'should reset to default');
    expect(storageSpy.set).toHaveBeenCalledTimes(2);
    expect(wsSpy.put).toHaveBeenCalledTimes(1);
  });

  describe('#initialSync', () => {
    const studentProfile = {
      BLOCK: true,
      COUNTRY: 'Malaysia',
      DATE: '11-Jun-2020',
      EMGS_COUNTRY_CODE: 'IRN',
      IC_PASSPORT_NO: 'B96141833',
      INTAKE: 'UC3F1511IT(ISS)',
      INTAKE_STATUS: 'Active',
      MENTOR_NAME: 'N/A',
      MENTOR_SAMACCOUNTNAME: null,
      MESSAGE: null,
      NAME: 'MOHAMMADREZA GANJI',
      PHOTO_NO: 'TP10000000019117',
      PL_NAME: 'NUR KHAIRUNNISHA BINTI ZAINAL',
      PL_SAMACCOUNTNAME: 'khairunnisha.zainal',
      PROGRAMME: 'BSc (Hons) in Information Technology',
      PROVIDER_CODE: 'APU',
      STUDENT_EMAIL: 'TP032353@mail.apu.edu.my',
      STUDENT_NUMBER: 'TP032353',
      STUDENT_STATUS: 'Completed'
    };
    const staffProfile = [
      {
        CODE: 'APPSTESTSTAFF1',
        CURRENT_JOB_TYPE: 'Full-time',
        DATE_JOINED: 'Thu, 05 Jul 2018 00:00:00 GMT',
        DEPARTMENT: 'Centre of Technology and Innovation',
        DEPARTMENT2: '',
        DEPARTMENT3: '',
        DID: '',
        DOB: 'Fri, 01 Jan 1999 00:00:00 GMT',
        EMAIL: '',
        EXTENSION: '',
        FULLNAME: 'TEST ACADEMIC STAFF FOR MOBILE APP',
        ID: 'appsteststaff1',
        LOCATION: null,
        NATIONALITY: 'Malaysian',
        NRIC: '',
        PASSPORTNO: '',
        PHOTO: 'https://d37plr7tnxt7lb.cloudfront.net/1080.jpg',
        REFNO: 1080,
        TITLE: 'Software Developer'
      }
    ];
    const tests = [
      { name: 'student', role: Role.Student, profile: studentProfile },
      { name: 'staff', role: Role.Lecturer, profile: staffProfile },
      { name: 'admin', role: Role.Admin, profile: staffProfile },
    ];
    tests.forEach(test => {
      it(`should merge data for ${test.name}`, fakeAsync(() => {
        jasmine.clock().mockDate(new Date(2000)); // epoch 2
        storageSpy.get.and.callFake(key => {
          switch (key) {
            case 'role': return Promise.resolve(test.role);
            case 'settings': return Promise.resolve({
              version: '2020-05-27',
              appVersion: '1.2.3',
              tripFrom: { epoch: 3, data: 'vista' }, // new
              tripTo: { epoch: 1, data: 'mosque' },  // old
              intakeHistory: { epoch: 2, data: [] }, // same
              // viewWeek not stored
            });
            default: return Promise.resolve(null);
          }
        });
        httpClientSpy.get.and.returnValue(asyncData({
          version: '2020-05-27',
          appVersion: '1.2.3',
          tripFrom: { epoch: 1, data: 'endah' }, // old
          tripTo: { epoch: 3, data: 'fortune' }, // new
          intakeHistory: { epoch: 2, data: [] }, // same
          abracadabra: { epoch: 1, data: null }, // deprecated
        }));
        wsSpy.get.and.returnValue(asyncData(test.profile));
        wsSpy.delete.and.returnValue(asyncData(null));
        const expected = {
          tripFrom: ['', 'vista'],
          tripTo: ['', 'mosque', 'fortune'],
          intakeHistory: [[]],
          viewWeek: [false],
        };
        service = TestBed.inject(SettingsService);
        Object.keys(expected).forEach(key => {
          service.get$(key as keyof Settings).subscribe(
            data => expect(data).toEqual(expected[key].shift()),
            fail,
            fail
          );
        });
        service.initialSync();
        flushMicrotasks();
        expect(wsSpy.get).toHaveBeenCalledTimes(1);
        expect(wsSpy.post).not.toHaveBeenCalled();
        expect(wsSpy.put).not.toHaveBeenCalled();
        expect(wsSpy.delete).toHaveBeenCalledTimes(1);
        expect(wsSpy.delete).toHaveBeenCalledWith('/settings-sync/abracadabra');
      }));
    });

    it('should create settings if not exists', fakeAsync(() => {
      const errorResponse = new HttpErrorResponse({
        error: 'Settings not found',
        status: 404, statusText: 'Not found'
      });
      storageSpy.get.and.callFake(key => Promise.resolve(key === 'role' ? Role.Student : null));
      httpClientSpy.get.and.returnValue(asyncError(errorResponse));
      wsSpy.get.and.returnValue(asyncData(studentProfile));
      wsSpy.post.and.returnValue(asyncData(''));
      service = TestBed.inject(SettingsService);
      service.initialSync();
      flushMicrotasks();
      expect(wsSpy.get).toHaveBeenCalledTimes(1);
      expect(wsSpy.post).toHaveBeenCalledTimes(1);
    }));
  });
});

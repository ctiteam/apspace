import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { asyncData, asyncError } from '../../testing';
import { CasTicketService } from './cas-ticket.service';
import { WsApiService } from './ws-api.service';

describe('WsApiService', () => {
  let service: WsApiService;
  let httpClientSpy: { get: jasmine.Spy };
  let networkSpy: { type: jasmine.Spy };
  let storageSpy: { get: jasmine.Spy, set: jasmine.Spy };
  let platformSpy: { is: jasmine.Spy };
  let casSpy: { getST: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    networkSpy = jasmine.createSpyObj('Network', ['type']);
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);
    platformSpy = jasmine.createSpyObj('Platform', ['is']);
    casSpy = jasmine.createSpyObj('CasTicketService', ['getST']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: CasTicketService, useValue: casSpy },
        { provide: Network, useValue: networkSpy },
        { provide: Storage, useValue: storageSpy },
      ]
    });
    service = TestBed.get(WsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should should respond on 200', fakeAsync(() => {
    const expectedData = 'hello world';
    httpClientSpy.get.and.returnValue(asyncData(expectedData));

    platformSpy.is.and.callFake(plt => plt === 'core');
    casSpy.getST.and.returnValue(asyncData('ticket'));

    service.get('/api').subscribe(
      data => expect(data).toEqual(expectedData, 'expected data'),
      fail
    );

    tick(); // required for HttpClient call in switchMap
    expect(platformSpy.is).toHaveBeenCalled();
    expect(storageSpy.get).not.toHaveBeenCalled();
    expect(casSpy.getST).toHaveBeenCalledTimes(1);

    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(storageSpy.set).toHaveBeenCalled();
  }));

  it('should return error on 4xx without retry', fakeAsync(() => {
    const endpoint = '/api';
    const errorResponse = new HttpErrorResponse({
      error: 'test 401 error',
      status: 401, statusText: 'Unauthorized'
    });

    platformSpy.is.and.callFake(plt => plt === 'cordova');
    storageSpy.get.and.returnValue(asyncData('data'));
    casSpy.getST.and.returnValue(asyncData('ticket'));
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    service.get(endpoint).subscribe(
      () => fail('should receive an error'),
      err => expect(err).toEqual(errorResponse),
    );
  }));

  it('should return null on 500 after retries if not cached', fakeAsync(() => {
    const endpoint = '/api';

    platformSpy.is.and.callFake(plt => plt === 'cordova');
    storageSpy.get.and.returnValue(asyncData('data'));
    casSpy.getST.and.returnValue(asyncData('ticket'));
    httpClientSpy.get.and.returnValue(asyncError('failed'));

    service.get(endpoint).subscribe(
      data => expect(data).toEqual('data'),
      fail,
    );

    tick();
    expect(casSpy.getST).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);

    tick(10000);  // 1st retry max 10s
    tick(12000);  // 2st retry max 12s
    tick(16000);  // 3st retry max 16s
    tick(24000);  // 4st retry max 24s
    expect(networkSpy.type).not.toHaveBeenCalled();
    expect(storageSpy.get).toHaveBeenCalledWith(endpoint);
  }));

  it('#caching network-or-cache', fakeAsync(() => {
    const endpoint = '/api';

    platformSpy.is.and.callFake(plt => plt === 'cordova');
    casSpy.getST.and.returnValue(asyncData('ticket'));
    const expected = [1, 2];
    storageSpy.get.and.returnValue(Promise.resolve(expected[0]));
    httpClientSpy.get.and.returnValue(asyncData(expected[1]));

    let n = 0;
    service.get(endpoint, { caching: 'cache-update-refresh' }).subscribe(
      data => expect(data).toBe(expected[n++], 'missing step ' + n),
      fail,
      () => expect(n).toBe(2, 'does not complete')
    );
    // XXX: not able to use marble testing because of Promise
    // expectObservable(source$).toBe('-(2|)', { 1: 1, 2: 2 });

    tick();
    expect(casSpy.getST).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(networkSpy.type).not.toHaveBeenCalled();
    expect(storageSpy.get).toHaveBeenCalledWith(endpoint);
  }));

  it('should always request on browser', fakeAsync(() => {
    const endpoint = '/api';

    platformSpy.is.and.callFake(plt => plt === 'desktop');
    casSpy.getST.and.returnValue(asyncData('ticket'));
    storageSpy.get.and.returnValue(Promise.resolve('fail'));
    httpClientSpy.get.and.returnValue(asyncData('success'));

    service.get(endpoint, { caching: 'cache-only' }).subscribe(
      data => expect(data).toEqual('success'),
      fail,
    );

    expect(casSpy.getST).toHaveBeenCalledTimes(1);
    tick(); // tick required for switchMap
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(storageSpy.get).not.toHaveBeenCalled();
  }));
});

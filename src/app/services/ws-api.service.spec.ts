import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { asyncData, asyncError } from '../../testing';
import { CasTicketService } from './cas-ticket.service';
import { WsApiService } from './ws-api.service';

describe('WsApiService', () => {
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
  });

  it('should be created', () => {
    const service: WsApiService = TestBed.get(WsApiService);
    expect(service).toBeTruthy();
  });

  it('should should respond on 200', fakeAsync(() => {
    const expectedData = 'hello world';
    httpClientSpy.get.and.returnValue(asyncData(expectedData));

    platformSpy.is.and.returnValue('core');
    casSpy.getST.and.returnValue(asyncData('ticket'));
    const service: WsApiService = TestBed.get(WsApiService);

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

  it('should return null on 500 after retries if not cached', fakeAsync(() => {
    const endpoint = '/api';

    const service: WsApiService = TestBed.get(WsApiService);

    platformSpy.is.and.returnValue('core');
    storageSpy.get.and.returnValue(asyncData(null));
    casSpy.getST.and.returnValue(asyncData('ticket'));
    httpClientSpy.get.and.returnValue(asyncError('failed'));

    service.get(endpoint).subscribe(
      data => expect(data).toBeNull(),
      fail,
    );

    tick(10000);  // 1st retry max 10s
    expect(casSpy.getST).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    expect(networkSpy.type).not.toHaveBeenCalled();
    expect(storageSpy.get).toHaveBeenCalledWith(endpoint);

    // XXX: should be called 3 times
    // tick(12000);  // 2st retry max 12s
    // expect(casSpy.getST).toHaveBeenCalledTimes(2);
    // expect(httpClientSpy.get).toHaveBeenCalledTimes(2);
    // expect(networkSpy.type).not.toHaveBeenCalled();
    // expect(storageSpy.get).toHaveBeenCalledWith(endpoint);
  }));

  it('#caching network-or-cache', fakeAsync(() => {
    const endpoint = '/api';

    const service: WsApiService = TestBed.get(WsApiService);

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
});

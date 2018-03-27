import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Storage } from '@ionic/storage';

export interface RequestCacheEntry {
  headers: { [header: string]: string | string[]; };
  body: any;
}

export abstract class RequestCache {
  abstract get(req: HttpRequest<any>): Observable<HttpResponse<any> | undefined>;
  abstract set(req: HttpRequest<any>, response: HttpResponse<any>): void
}

/** RequestCache implementation with Map object */
@Injectable()
export class RequestCacheWithMap implements RequestCache {

  cache = new Map<string, HttpResponse<any>>();

  constructor() { }

  get(req: HttpRequest<any>): Observable<HttpResponse<any> | undefined> {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    return Observable.of(cached);
  }

  set(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;

    this.cache.set(url, response);
  }

}

/** RequestCache implementation with ionic Storage */
@Injectable()
export class RequestCacheWithStorage implements RequestCache {

  constructor(public storage: Storage) { }

  get(req: HttpRequest<any>): Observable<HttpResponse<any> | undefined> {
    const url = req.urlWithParams;
    return Observable.fromPromise(this.storage.get(url)).map(cached => {
      if (!cached) {
        return undefined;
      }

      const headers = new HttpHeaders(cached.headers);
      return new HttpResponse({ url, headers, body: cached.body });
    });
  }

  set(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    const headers = getHeaders(response);
    const entry = { headers, body: response.body };

    this.storage.set(url, entry);
  }

}

/** RequestCache implementation with Map object and ionic Storage */
@Injectable()
export class RequestCacheWithMapStorage implements RequestCache {

  cache = new Map<string, HttpResponse<any>>();

  constructor(public storage: Storage) { }

  get(req: HttpRequest<any>): Observable<HttpResponse<any> | undefined> {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (cached) { return Observable.of(cached); }

    return Observable.fromPromise(this.storage.get(url)).map(cached => {
      if (!cached) {
        return undefined;
      }

      const headers = new HttpHeaders(cached.headers);
      return new HttpResponse({ url, headers, body: cached.body });
    });
  }

  set(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.urlWithParams;
    const headers = getHeaders(response);
    const entry = { headers, body: response.body };

    this.cache.set(url, response);
    this.storage.set(url, entry);
  }

}

/** Get all the headers from lazy-parsed headers. */
function getHeaders(response: HttpResponse<any>): { [header: string]: string | string[]; } {
  return response.headers.keys().reduce((acc, cur) => {
    acc[cur] = response.headers.get(cur);
    return acc;
  }, {});
}

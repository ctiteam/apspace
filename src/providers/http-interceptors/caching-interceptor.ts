import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';

import { RequestCache } from '../';

/**
 * Inject caching request header.
 *
 * If request is cachable, return cache on next request unless 'x-refresh'.
 *
 * If has 'x-refresh' header, does not inject headers to request, return
 * observable from cached response first followed by response from next().
 */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  constructor(private cache: RequestCache) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') { return next.handle(req); }

    return this.cache.get(req).pipe(
      switchMap(cachedResponse => {
        const refresh = req.headers.has('x-refresh');

        if (!cachedResponse) {
          return sendRequest(req, next, this.cache);
        } else if (!refresh) {
          return of(cachedResponse);
        }

        const etag = cachedResponse.headers.get('ETag');
        const lastModified = cachedResponse.headers.get('Last-Modified');
        if (etag) {
          req = req.clone({ headers: req.headers.set('If-None-Match', etag) });
        } else if (lastModified) {
          req = req.clone({ headers: req.headers.set('If-Modified-Since', lastModified) });
        }

        const results$ = sendRequest(req, next, this.cache).pipe(
          catchError(_ => of(cachedResponse)),
        );
        return refresh ? results$.pipe(startWith(cachedResponse)) : results$;
      }),
    );
  }
}

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
function sendRequest(req: HttpRequest<any>, next: HttpHandler, cache: RequestCache): Observable<HttpEvent<any>> {
  // remove self-defined headers
  req = req.clone({ headers: req.headers.delete('x-refresh') });

  return next.handle(req).pipe(tap(event => {
    if (event instanceof HttpResponse) {
      if (event.headers.has('ETag') || event.headers.has('Last-Modified')) {
        cache.set(req, event);
      }
    }
  }));
}

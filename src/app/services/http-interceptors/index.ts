/** "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CachingInterceptor } from './caching-interceptor.service';

/** Http interceptor providers in outside-in order */
export const httpInterceptorServices = [
  { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
];

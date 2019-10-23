import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { CasTicketService } from '../services';

describe('AuthGuard', () => {
  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const casTicketServiceSpy = spyOnProperty(CasTicketService.prototype, 'isAuthenticated')
      .and.returnValue(Promise.resolve(false));

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: CasTicketService, useValue: casTicketServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should redirect if not logged in', inject([Router, AuthGuard], async (router, guard) => {
    expect(await guard.canActivate()).toBeFalsy();
    expect(router.navigate.calls.count()).toBe(1);
    expect(router.navigate.calls.first().args[0]).toEqual(['/login']);
  }));
});

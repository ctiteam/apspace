import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { CasTicketService } from '../services';
import { DeauthGuard } from './deauth.guard';

describe('DeauthGuard', () => {
  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const casTicketServiceSpy = jasmine.createSpyObj('CasTicketService', {
      isAuthenticated: Promise.resolve(true)
    });

    TestBed.configureTestingModule({
      providers: [
        DeauthGuard,
        { provide: CasTicketService, useValue: casTicketServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should redirect if not logged in', inject([Router, DeauthGuard], async (router, guard) => {
    expect(await guard.canActivate()).toBeFalsy();
    expect(router.navigate.calls.count()).toBe(1);
    expect(router.navigate.calls.first().args[0]).toEqual(['/']);
  }));
});

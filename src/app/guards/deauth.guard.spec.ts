import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CasTicketService } from '../services';
import { DeauthGuard } from './deauth.guard';

describe('DeauthGuard', () => {
  let casTicketServiceSpy: { isAuthenticated: jasmine.Spy };

  beforeEach(() => {
    casTicketServiceSpy = jasmine.createSpyObj('CasTicketService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        DeauthGuard,
        { provide: CasTicketService, useValue: casTicketServiceSpy },
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should redirect if logged in', inject([Router, DeauthGuard], async (router, guard) => {
    spyOn(router, 'createUrlTree').and.callThrough();
    casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));

    const expected = router.parseUrl('/');
    expected.fragment = undefined;
    expect(await guard.canActivate()).toEqual(expected);
  }));

  it('should not redirect if not logged in', inject([Router, DeauthGuard], async (router, guard) => {
    spyOn(router, 'createUrlTree').and.callThrough();
    casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));

    expect(await guard.canActivate()).toEqual(true);
  }));
});

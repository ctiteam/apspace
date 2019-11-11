import { inject, TestBed } from '@angular/core/testing';
import { Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Role } from '../interfaces';
import { CasTicketService, SettingsService } from '../services';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let settingsSpy: { ready: jasmine.Spy, get: jasmine.Spy };
  let casTicketServiceSpy: { isAuthenticated: jasmine.Spy };

  beforeEach(() => {
    settingsSpy = jasmine.createSpyObj('SettingsService', ['ready', 'get']);
    casTicketServiceSpy = jasmine.createSpyObj('CasTicketService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: CasTicketService, useValue: casTicketServiceSpy },
        { provide: SettingsService, useValue: settingsSpy }
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should redirect if authenticated', inject([Router, AuthGuard], async (router, guard) => {
    spyOn(router, 'createUrlTree').and.callThrough();
    settingsSpy.ready.and.returnValue(Promise.resolve());
    casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));
    const route = { url: new UrlSegment('tabs', {}), data: {} };
    const state = { url: route.url.toString() };

    expect(await guard.canActivate(route, state)).toEqual(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  }));

  it('should redirect if not authenticated', inject([Router, AuthGuard], async (router, guard) => {
    spyOn(router, 'createUrlTree').and.callThrough();
    settingsSpy.ready.and.returnValue(Promise.resolve());
    casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));
    const route = { url: new UrlSegment('tabs', {}), data: {} };
    const state = { url: route.url.toString() };

    const expected = router.parseUrl('/login');
    expected.fragment = undefined;
    expect(await guard.canActivate(route, state)).toEqual(expected);
    expect(router.createUrlTree).toHaveBeenCalledTimes(1);
  }));

  it('should redirect with state if not authenticated', inject([Router, AuthGuard], async (router, guard) => {
    spyOn(router, 'createUrlTree').and.callThrough();
    settingsSpy.ready.and.returnValue(Promise.resolve());
    casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(false));
    const route = { url: new UrlSegment('hello', {}), data: {} };
    const state = { url: route.url.toString() };

    const expected = router.parseUrl('/login?redirect=hello');
    expected.fragment = undefined;
    expect(await guard.canActivate(route, state)).toEqual(expected);
    expect(router.createUrlTree).toHaveBeenCalledTimes(1);
  }));

  it('should redirect if not authorized', inject([Router, AuthGuard], async (router, guard) => {
    spyOn(router, 'createUrlTree').and.callThrough();
    settingsSpy.ready.and.returnValue(Promise.resolve());
    settingsSpy.get.and.returnValue(Role.Student);
    casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));
    const route = { url: new UrlSegment('tabs', {}), data: { role: Role.Lecturer } };
    const state = { url: route.url.toString() };

    const expected = router.parseUrl('/unauthorized');
    expected.fragment = undefined;
    expect(await guard.canActivate(route, state)).toEqual(expected);
    expect(router.createUrlTree).toHaveBeenCalledTimes(1);
    expect(settingsSpy.get).toHaveBeenCalledTimes(1);
    expect(settingsSpy.get).toHaveBeenCalledWith('role');
  }));
});

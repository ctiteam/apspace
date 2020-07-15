import { TestBed, inject } from '@angular/core/testing';
import { Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage';

import { Role } from '../interfaces';
import { CasTicketService, SettingsService } from '../services';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let casTicketServiceSpy: { isAuthenticated: jasmine.Spy };
  let settingsSpy: { ready: jasmine.Spy };
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    casTicketServiceSpy = jasmine.createSpyObj('CasTicketService', ['isAuthenticated']);
    settingsSpy = jasmine.createSpyObj('SettingsService', ['ready']);
    storageSpy = jasmine.createSpyObj('Storage', ['get']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: CasTicketService, useValue: casTicketServiceSpy },
        { provide: SettingsService, useValue: settingsSpy },
        { provide: Storage, useValue: storageSpy },
      ],
      imports: [RouterTestingModule]
    });
  });

  // canActivate and canActivateChild behaves the same
  ['canActivate', 'canActivateChild'].forEach(test => describe(test, () => {
    it('should redirect if authenticated', inject([Router, AuthGuard], async (router, guard) => {
      spyOn(router, 'createUrlTree').and.callThrough();
      casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));
      settingsSpy.ready.and.returnValue(Promise.resolve());
      const route = { url: new UrlSegment('tabs', {}), data: {} };
      const state = { url: route.url.toString() };

      expect(await guard[test](route, state)).toEqual(true);
      expect(storageSpy.get).not.toHaveBeenCalled();
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
      expect(await guard[test](route, state)).toEqual(expected);
      expect(storageSpy.get).not.toHaveBeenCalled();
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
      expect(await guard[test](route, state)).toEqual(expected);
      expect(router.createUrlTree).toHaveBeenCalledTimes(1);
    }));

    it('should redirect if no settings', inject([Router, AuthGuard], async (router, guard) => {
      spyOn(router, 'createUrlTree').and.callThrough();
      settingsSpy.ready.and.returnValue(Promise.resolve());
      storageSpy.get.and.returnValue(Promise.resolve());
      casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));
      const route = { url: new UrlSegment('tabs', {}), data: { role: Role.Lecturer } };
      const state = { url: route.url.toString() };

      const expected = router.parseUrl('/logout');
      expected.fragment = undefined;
      expect(await guard[test](route, state)).toEqual(expected);
      expect(router.createUrlTree).toHaveBeenCalledTimes(1);
      expect(storageSpy.get).toHaveBeenCalledTimes(1);
      expect(storageSpy.get).toHaveBeenCalledWith('role');
    }));

    it('should redirect if not authorized', inject([Router, AuthGuard], async (router, guard) => {
      spyOn(router, 'createUrlTree').and.callThrough();
      settingsSpy.ready.and.returnValue(Promise.resolve());
      storageSpy.get.and.returnValue(Promise.resolve(Role.Student));
      casTicketServiceSpy.isAuthenticated.and.returnValue(Promise.resolve(true));
      const route = { url: new UrlSegment('tabs', {}), data: { role: Role.Lecturer } };
      const state = { url: route.url.toString() };

      const expected = router.parseUrl('/unauthorized');
      expected.fragment = undefined;
      expect(await guard[test](route, state)).toEqual(expected);
      expect(router.createUrlTree).toHaveBeenCalledTimes(1);
      expect(storageSpy.get).toHaveBeenCalledTimes(1);
      expect(storageSpy.get).toHaveBeenCalledWith('role');
    }));
  }));
});

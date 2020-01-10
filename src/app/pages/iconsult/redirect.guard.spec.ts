import { TestBed, inject } from '@angular/core/testing';
import { Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Role } from '../../interfaces';
import { SettingsService } from '../../services';
import { RedirectGuard } from './redirect.guard';

describe('RedirectGuard', () => {
  let settingsSpy: { get: jasmine.Spy };

  beforeEach(() => {
    settingsSpy = jasmine.createSpyObj('SettingsService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        RedirectGuard,
        { provide: SettingsService, useValue: settingsSpy }
      ],
      imports: [RouterTestingModule]
    });
  });

  const tests = [
    { name: 'student', role: Role.Student, path: 'my-appointments' },
    { name: 'staff', role: Role.Admin, path: 'my-consultations' },
    { name: 'lecturer', role: Role.Lecturer, path: 'my-consultations' },
  ];

  tests.forEach(test => it(`should redirect ${test.name} to ${test.path}`, inject([Router, RedirectGuard], async (router, guard) => {
    spyOn(router, 'createUrlTree').and.callThrough();
    settingsSpy.get.and.returnValue(test.role);
    const route = { url: new UrlSegment('iconsult', {}), data: {} };
    const state = { url: route.url.toString() };

    const expected = router.parseUrl(`/iconsult/${test.path}`);
    expected.fragment = undefined;
    expect(await guard.canActivate(route, state)).toEqual(expected);
    expect(router.createUrlTree).toHaveBeenCalledTimes(1);
  })));

});

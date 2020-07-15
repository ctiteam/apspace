import { TestBed, inject } from '@angular/core/testing';
import { Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage';

import { Role } from '../../interfaces';
import { RedirectGuard } from './redirect.guard';

describe('RedirectGuard', () => {
  let storageSpy: { get: jasmine.Spy };

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get']);

    TestBed.configureTestingModule({
      providers: [
        RedirectGuard,
        { provide: Storage, useValue: storageSpy }
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
    storageSpy.get.and.returnValue(Promise.resolve(test.role));
    const route = { url: new UrlSegment('iconsult', {}), data: {} };
    const state = { url: route.url.toString() };

    const expected = router.parseUrl(`/iconsult/${test.path}`);
    expected.fragment = undefined;
    expect(await guard.canActivate(route, state)).toEqual(expected);
    expect(router.createUrlTree).toHaveBeenCalledTimes(1);
  })));

});

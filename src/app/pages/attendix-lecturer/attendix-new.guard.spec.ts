import { TestBed, inject } from '@angular/core/testing';

import { AttendixNewGuard } from './attendix-new.guard';

describe('AttendixNewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendixNewGuard]
    });
  });

  it('should ...', inject([AttendixNewGuard], (guard: AttendixNewGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { MentorshipService } from './mentorship.service';

describe('MentorshipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MentorshipService = TestBed.get(MentorshipService);
    expect(service).toBeTruthy();
  });
});

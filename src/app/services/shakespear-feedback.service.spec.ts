import { TestBed } from '@angular/core/testing';

import { ShakespearFeedbackService } from './shakespear-feedback.service';

describe('ShakespearFeedbackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShakespearFeedbackService = TestBed.inject(ShakespearFeedbackService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MentorshipService } from './mentorship.service';
import { WsApiService } from './ws-api.service';

describe('MentorshipService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: WsApiService, useValue: {} }
    ],
  }));

  it('should be created', () => {
    const service: MentorshipService = TestBed.inject(MentorshipService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { WebspacePasswordService } from './webspace-password.service';

describe('WebspacePasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebspacePasswordService = TestBed.inject(WebspacePasswordService);
    expect(service).toBeTruthy();
  });
});

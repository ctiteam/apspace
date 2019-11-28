import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Platform } from '@ionic/angular';

import { FeedbackService } from './feedback.service';
import { WsApiService } from './ws-api.service';

describe('FeedbackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useValue: {} },
        { provide: WsApiService, useValue: {} },
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', () => {
    const service: FeedbackService = TestBed.get(FeedbackService);
    expect(service).toBeTruthy();
  });
});

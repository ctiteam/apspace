import { inject } from '@angular/core/testing';

import { SettingsService } from '../../services';
import { DateWithTimezonePipe } from './date-with-timezone.pipe';

describe('DateWithTimezonePipe', () => {
  it('create an instance', inject([SettingsService], (settings: SettingsService) => {
    const pipe = new DateWithTimezonePipe(settings);
    expect(pipe).toBeTruthy();
  }));
});

import { DateWithTimezonePipe } from './date-with-timezone.pipe';

describe('DateWithTimezonePipe', () => {
  it('create an instance', () => {
    const pipe = new DateWithTimezonePipe();
    expect(pipe).toBeTruthy();
  });
});

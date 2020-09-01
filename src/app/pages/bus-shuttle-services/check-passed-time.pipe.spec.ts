import { CheckPassedTimePipe } from './check-passed-time.pipe';

describe('CheckPassedTimePipe', () => {
  it('create an instance', () => {
    const pipe = new CheckPassedTimePipe();
    expect(pipe).toBeTruthy();
  });
});

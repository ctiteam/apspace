import { DisabledPipe } from './disabled.pipe';

describe('DisabledPipe', () => {
  it('create an instance', () => {
    const pipe = new DisabledPipe();
    expect(pipe).toBeTruthy();
  });
});

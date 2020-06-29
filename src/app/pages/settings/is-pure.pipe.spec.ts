import { IsPurePipe } from './is-pure.pipe';

describe('IsPurePipe', () => {
  it('create an instance', () => {
    const pipe = new IsPurePipe();
    expect(pipe).toBeTruthy();
  });
});

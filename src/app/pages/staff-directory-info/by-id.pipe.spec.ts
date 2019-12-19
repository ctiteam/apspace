import { ByIdPipe } from './by-id.pipe';

describe('ByIdPipe', () => {
  it('create an instance', () => {
    const pipe = new ByIdPipe();
    expect(pipe).toBeTruthy();
  });
});

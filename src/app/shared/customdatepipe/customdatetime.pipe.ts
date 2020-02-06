import { CustomDateTimePipe } from './customdatetime';

describe('CustomDateTimePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDateTimePipe();
    expect(pipe).toBeTruthy();
  });
});

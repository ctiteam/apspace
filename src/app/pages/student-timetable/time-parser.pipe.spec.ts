import { TimeParserPipe } from './time-parser.pipe';

describe('TimeParserPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeParserPipe();
    expect(pipe).toBeTruthy();
  });
});

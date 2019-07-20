import { CharsPipe } from './chars.pipe';

describe('CharsPipe', () => {
  it('create an instance', () => {
    const pipe = new CharsPipe();
    expect(pipe).toBeTruthy();
  });

  it('should splits string', () => {
    const pipe = new CharsPipe();
    expect(pipe.transform('value')).toEqual(['v', 'a', 'l', 'u', 'e']);
  });
});

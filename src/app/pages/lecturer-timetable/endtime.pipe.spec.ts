import { EndtimePipe } from './endtime.pipe';

describe('EndtimePipe', () => {
  it('create an instance', () => {
    const pipe = new EndtimePipe();
    expect(pipe).toBeTruthy();
  });

  it('should calculate end time', () => {
    const actual = {
      time: '2019-10-31T10:35:00+08:00',
      location: 'NEW CAMPUS',
      room: 'B-08-04',
      module: 'CT060-3-3-EMTECH-T',
      duration: 7200,
      intakes: [
        'UC3F1906CS',
        'UC3F1906IS'
      ]
    };
    const expected = Date.parse('2019-10-31T12:35:00+08:00');
    const pipe = new EndtimePipe();
    expect(pipe.transform(actual)).toEqual(expected);
  });
});

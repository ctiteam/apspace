import { ThedayPipe } from './theday.pipe';

describe('ThedayPipe', () => {
  it('create an instance', () => {
    const pipe = new ThedayPipe();
    expect(pipe).toBeTruthy();
  });

  it('should match only the same day', () => {
    const lecturerTimetableMock = [
      {
        module: 'CT098-3-2-RMCT-T-3',
        location: 'NEW CAMPUS',
        room: 'D-08-04',
        duration: 7200,
        time: '2019-11-27T14:00:00+08:00',
        intakes: [
          'UCFF0000SE'
        ]
      },
      {
        module: 'CT098-3-2-RMCT-T-3',
        location: 'NEW CAMPUS',
        room: 'D-08-04',
        duration: 7200,
        time: '2019-11-27T16:00:00+08:00',
        intakes: [
          'UCFF0000SE'
        ]
      },
      {
        room: 'E-07-09',
        module: 'CT012-3-3-CSM-T',
        location: 'NEW CAMPUS',
        duration: 7200,
        time: '2019-11-28T08:30:00+08:00',
        intakes: [
          'UCFF0000IT(CC)',
          'UCFF0000IT(ISS)'
        ]
      },
      {
        module: 'CT098-3-2-RMCT-T-3',
        location: 'NEW CAMPUS',
        room: 'D-08-04',
        duration: 7200,
        time: '2019-12-27T16:00:00+08:00',
        intakes: [
          'UCFF0000SE'
        ]
      },
    ];
    const pipe = new ThedayPipe();
    const output = pipe.transform(lecturerTimetableMock, new Date('2019-11-27'));
    expect(output.length).toEqual(2);
  });
});

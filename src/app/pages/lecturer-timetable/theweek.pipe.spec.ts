import { TheweekPipe } from './theweek.pipe';

describe('TheweekPipe', () => {
  it('create an instance', () => {
    const pipe = new TheweekPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return only one week', () => {
    const lecturerTimetableMock = [
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
        location: 'NEW CAMPUS',
        room: 'B-08-04',
        time: '2019-11-28T10:35:00+08:00',
        module: 'CT060-3-3-EMTECH-T',
        duration: 7200,
        intakes: [
          'UCFF0000CS',
          'UCFF0000IS'
        ]
      },
      {
        duration: 3600,
        time: '2019-11-29T14:45:00+08:00',
        room: 'D-06-08',
        location: 'NEW CAMPUS',
        module: 'CT012-3-3-CSM-L',
        intakes: [
          'UCFF0000IT',
          'UCFF0000IT(BIS)',
          'UCFF0000IT(CC)',
          'UCFF0000IT(IOT)',
          'UCFF0000IT(ISS)'
        ]
      },
      {
        duration: 3600,
        room: 'B-06-02',
        module: 'CT060-3-3-EMTECH-L',
        location: 'NEW CAMPUS',
        time: '2019-12-03T12:40:00+08:00',
        intakes: [
          'UCFF0000CS(DA)',
          'UCFF0000CS',
          'UCFF0000IS'
        ]
      },
      {
        location: 'NEW CAMPUS',
        time: '2019-12-04T08:30:00+08:00',
        module: 'CT060-3-3-EMTECH-T',
        duration: 7200,
        room: 'D-07-14',
        intakes: [
          'UCFF0000CS(DA)'
        ]
      },
      {
        module: 'CT098-3-2-RMCT-T-2',
        location: 'NEW CAMPUS',
        time: '2019-12-04T13:45:00+08:00',
        room: 'D-08-03',
        duration: 7200,
        intakes: [
          'UCFF0000SE'
        ]
      },
      {
        module: 'CT098-3-2-RMCT-T-3',
        time: '2019-12-04T16:00:00+08:00',
        location: 'NEW CAMPUS',
        room: 'D-08-04',
        duration: 7200,
        intakes: [
          'UCFF0000SE'
        ]
      },
      {
        room: 'E-07-09',
        module: 'CT012-3-3-CSM-T',
        location: 'NEW CAMPUS',
        duration: 7200,
        time: '2019-12-05T08:30:00+08:00',
        intakes: [
          'UCFF0000IT(ISS)',
          'UCFF0000IT(CC)'
        ]
      },
      {
        time: '2019-12-05T10:35:00+08:00',
        location: 'NEW CAMPUS',
        room: 'B-08-04',
        module: 'CT060-3-3-EMTECH-T',
        duration: 7200,
        intakes: [
          'UCFF0000IS',
          'UCFF0000CS'
        ]
      },
      {
        time: '2019-12-06T14:45:00+08:00',
        duration: 3600,
        room: 'D-06-08',
        location: 'NEW CAMPUS',
        module: 'CT012-3-3-CSM-L',
        intakes: [
          'UCFF0000IT',
          'UCFF0000IT(BIS)',
          'UC3F1911IT(CC)',
          'UCFF0000IT(IOT)',
          'UCFF0000IT(ISS)'
        ]
      }
    ];
    const pipe = new TheweekPipe();
    const firstWeek = pipe.transform(lecturerTimetableMock, new Date('2019-11-25'));
    console.log(firstWeek);
    expect(firstWeek.length).toEqual(4);
    expect(firstWeek).toContain(lecturerTimetableMock[0]);
    const secondWeek = pipe.transform(lecturerTimetableMock, new Date('2019-12-02'));
    expect(secondWeek.length).toEqual(7);
    expect(secondWeek).toContain(lecturerTimetableMock[lecturerTimetableMock.length - 1]);
  });
});

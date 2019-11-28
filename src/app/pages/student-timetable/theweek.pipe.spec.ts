import { TheWeekPipe } from './theweek.pipe';

describe('TheweekPipe', () => {
  it('create an instance', () => {
    const pipe = new TheWeekPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return only one week', () => {
    const studentTimetableMock = [
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'MON',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'AAA',
        NAME: 'AAA',
        SAMACCOUNTNAME: 'aaa',
        DATESTAMP: '11-NOV-19',
        DATESTAMP_ISO: '2019-11-11',
        TIME_FROM: '10:35 AM',
        TIME_TO: '12:35 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'MON',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'BBB',
        NAME: 'BBB',
        SAMACCOUNTNAME: 'bbb',
        DATESTAMP: '11-NOV-19',
        DATESTAMP_ISO: '2019-11-11',
        TIME_FROM: '04:00 PM',
        TIME_TO: '06:00 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'TUE',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'CCC',
        NAME: 'CCC',
        SAMACCOUNTNAME: 'ccc',
        DATESTAMP: '12-NOV-19',
        DATESTAMP_ISO: '2019-11-12',
        TIME_FROM: '12:40 PM',
        TIME_TO: '01:40 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'WED',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'CCC',
        NAME: 'CCC',
        SAMACCOUNTNAME: 'ccc',
        DATESTAMP: '13-NOV-19',
        DATESTAMP_ISO: '2019-11-13',
        TIME_FROM: '08:30 AM',
        TIME_TO: '10:30 AM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'WED',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'BBB',
        NAME: 'BBB',
        SAMACCOUNTNAME: 'bbb',
        DATESTAMP: '13-NOV-19',
        DATESTAMP_ISO: '2019-11-13',
        TIME_FROM: '12:40 PM',
        TIME_TO: '01:40 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'DDD',
        NAME: 'DDD',
        SAMACCOUNTNAME: 'ddd',
        DATESTAMP: '14-NOV-19',
        DATESTAMP_ISO: '2019-11-14',
        TIME_FROM: '08:30 AM',
        TIME_TO: '10:30 AM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'EEE',
        NAME: 'EEE',
        SAMACCOUNTNAME: 'eee',
        DATESTAMP: '14-NOV-19',
        DATESTAMP_ISO: '2019-11-14',
        TIME_FROM: '10:35 AM',
        TIME_TO: '12:05 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'AAA',
        NAME: 'AAA',
        SAMACCOUNTNAME: 'aaa',
        DATESTAMP: '14-NOV-19',
        DATESTAMP_ISO: '2019-11-14',
        TIME_FROM: '12:40 PM',
        TIME_TO: '01:40 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'EEE',
        NAME: 'EEE',
        SAMACCOUNTNAME: 'eee',
        DATESTAMP: '14-NOV-19',
        DATESTAMP_ISO: '2019-11-14',
        TIME_FROM: '01:45 PM',
        TIME_TO: '03:15 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'MON',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'AAA',
        NAME: 'AAA',
        SAMACCOUNTNAME: 'aaa',
        DATESTAMP: '18-NOV-19',
        DATESTAMP_ISO: '2019-11-18',
        TIME_FROM: '10:35 AM',
        TIME_TO: '12:35 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'MON',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'BBB',
        NAME: 'BBB',
        SAMACCOUNTNAME: 'bbb',
        DATESTAMP: '18-NOV-19',
        DATESTAMP_ISO: '2019-11-18',
        TIME_FROM: '04:00 PM',
        TIME_TO: '06:00 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'TUE',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'CCC',
        NAME: 'CCC',
        SAMACCOUNTNAME: 'ccc',
        DATESTAMP: '19-NOV-19',
        DATESTAMP_ISO: '2019-11-19',
        TIME_FROM: '12:40 PM',
        TIME_TO: '01:40 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'WED',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'CCC',
        NAME: 'CCC',
        SAMACCOUNTNAME: 'ccc',
        DATESTAMP: '20-NOV-19',
        DATESTAMP_ISO: '2019-11-20',
        TIME_FROM: '08:30 AM',
        TIME_TO: '10:30 AM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'WED',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'BBB',
        NAME: 'BBB',
        SAMACCOUNTNAME: 'bbb',
        DATESTAMP: '20-NOV-19',
        DATESTAMP_ISO: '2019-11-20',
        TIME_FROM: '12:40 PM',
        TIME_TO: '01:40 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'DDD',
        NAME: 'DDD',
        SAMACCOUNTNAME: 'ddd',
        DATESTAMP: '21-NOV-19',
        DATESTAMP_ISO: '2019-11-21',
        TIME_FROM: '08:30 AM',
        TIME_TO: '10:30 AM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'EEE',
        NAME: 'EEE',
        SAMACCOUNTNAME: 'eee',
        DATESTAMP: '21-NOV-19',
        DATESTAMP_ISO: '2019-11-21',
        TIME_FROM: '10:35 AM',
        TIME_TO: '12:05 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'AAA',
        NAME: 'AAA',
        SAMACCOUNTNAME: 'aaa',
        DATESTAMP: '21-NOV-19',
        DATESTAMP_ISO: '2019-11-21',
        TIME_FROM: '12:40 PM',
        TIME_TO: '01:40 PM'
      },
      {
        INTAKE: 'INTAKE',
        MODID: 'MODID',
        DAY: 'THU',
        LOCATION: 'NEW CAMPUS',
        ROOM: 'ROOM',
        LECTID: 'EEE',
        NAME: 'EEE',
        SAMACCOUNTNAME: 'eee',
        DATESTAMP: '21-NOV-19',
        DATESTAMP_ISO: '2019-11-21',
        TIME_FROM: '01:45 PM',
        TIME_TO: '03:15 PM'
      }
    ];
    const pipe = new TheWeekPipe();
    const firstWeek = pipe.transform(studentTimetableMock, new Date('2019-11-10'));
    expect(firstWeek.length).toEqual(9);
    expect(firstWeek).toContain(studentTimetableMock[0]);
    const secondWeek = pipe.transform(studentTimetableMock, new Date('2019-11-17'));
    expect(secondWeek.length).toEqual(9);
    expect(secondWeek).toContain(studentTimetableMock[studentTimetableMock.length - 1]);
  });
});

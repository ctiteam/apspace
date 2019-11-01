import { Pipe, PipeTransform } from '@angular/core';

// TEMP: temp solution untill we create the API
// pipe for getting the section id and return a readable name
@Pipe({
  name: 'sectionName'
})
export class SectionNamePipe implements PipeTransform {

  transform(dashboardSectionID: string): string {
    enum sectionNames {
      quickAccess = 'Quick Access',
      todaysSchedule = 'Todays Schedule',
      upcomingEvents = 'Upcoming Events',
      lowAttendance = 'Attendance Summary',
      upcomingTrips = 'Upcoming Trips',
      apcard = 'APCard Transactions',
      cgpa = 'CGPA Per Intake',
      financials = 'Financials',
      news = 'Latest News',
      noticeBoard = 'Notice Board'
  }
    return sectionNames[dashboardSectionID];
  }

}

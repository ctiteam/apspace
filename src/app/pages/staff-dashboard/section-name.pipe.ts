import { Pipe, PipeTransform } from '@angular/core';

// TEMP: temp solution untill we create the API
// pipe for getting the section id and return a readable name
@Pipe({
  name: 'sectionName'
})
export class SectionNamePipe implements PipeTransform {

  transform(dashboardSectionID: string): string {
    enum sectionNames {
      todaysSchedule = 'Todays Schedule',
      upcomingEvents = 'Upcoming Events',
      upcomingTrips = 'Upcoming Trips',
      apcard = 'APCard Transactions',
      news = 'Latest News',
      noticeBoard = 'Notice Board',
      inspirationalQuote = 'Inspirational Quote'
  }
    return sectionNames[dashboardSectionID];
  }

}

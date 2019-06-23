import { Component, OnInit } from '@angular/core';
import { EventComponent } from 'src/app/interfaces';
import * as moment from 'moment';


@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.page.html',
  styleUrls: ['./student-dashboard.page.scss'],
})
export class StudentDashboardPage implements OnInit {
  // SLIDER OPTIONS
  slideOpts = {
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    speed: 500,
  };


  // Today's Schedule:
  todaysScheduleWithOptionsButton = true;
  todaysScheduleOptions = [
    {
      title: 'set alarm before 15 minutes of next schdule',
      icon: 'alarm',
      callbackFunction: this.testCallBack
    },
    {
      title: 'delete',
      icon: 'trash',
      callbackFunction: this.testCallBack
    }
  ]
  todaysScheduleCardTitle = "Today's Schedule";
  todaysScheduleCardSubtitle = moment().format("DD MMMM YYYY");

  testCallBack(){
    console.log('callback working');
  }

  todaysSchedule: EventComponent[] = [{
    title: '1 hour class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '08',
    secondaryDateTime: '30',
    quaternaryDateTime: 'AM',
    thirdDescription: 'Lower Ground Flr. SS Studio | New Campus',
    secondDescription: 'Mohamad Al Ghayeb',
    firstDescription: 'BM002-3-1-BES-T-2',
    pass: true
  },
  {
    title: '2 hours class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '10',
    secondaryDateTime: '00',
    quaternaryDateTime: 'AM',
    thirdDescription: 'B-05-03 | New Campus',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'KS004-3-3-BAT-L-5',
    pass: true
  },
  {
    title: '2 hours class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '11',
    secondaryDateTime: '30',
    quaternaryDateTime: 'AM',
    thirdDescription: 'Lower Ground Flr. SS Studio | New Campus',
    secondDescription: 'Mousa Sarah',
    firstDescription: 'AS002-3-1-BES-T-2',
    pass: false
  },
  {
    title: '2 hours class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '01',
    secondaryDateTime: '30',
    quaternaryDateTime: 'PM',
    thirdDescription: 'B-07-03 | New Campus',
    secondDescription: 'Majd Samer Ahemd Suraj Al Waleed',
    firstDescription: 'AW004-3-3-BAT-L-5',
    pass: false
  },
  {
    title: '2 hours class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',
    primaryDateTime: '02',
    secondaryDateTime: '00',
    quaternaryDateTime: 'PM',
    thirdDescription: 'B-07-03 | New Campus',
    secondDescription: 'Majd Samer Ahemd Suraj Al Waleed',
    firstDescription: 'AW004-3-3-BAT-L-5',
    pass: false
  },
  {
    title: 'Metting with Masters Supervisor',
    color: '#d35400',
    type: 'event-with-time-and-hyperlink',  
    primaryDateTime: '02',
    secondaryDateTime: '30',
    quaternaryDateTime: 'PM',
    thirdDescription: 'B-07-03 | New Campus',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'reza.ganji@apiit.edu.my',
    pass: false
  },
  {
    title: '1 hour class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',  
    primaryDateTime: '03',
    secondaryDateTime: '00',
    quaternaryDateTime: 'PM',
    thirdDescription: 'B-05-03 | New Campus',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'KS004-3-3-BAT-L-5',
    pass: false
  },
  {
    title: 'Meeting with Dean',
    color: '#d35400',
    type: 'event-with-time-and-hyperlink',  
    primaryDateTime: '04',
    secondaryDateTime: '00',
    quaternaryDateTime: 'PM',
    thirdDescription: 'LAB L3 - 08 | TPM',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'reza.ganji@apiit.edu.my',
    pass: false
  },
  {
    title: '1 hour class',
    color: '#27ae60',
    type: 'event-with-time-and-hyperlink',  
    primaryDateTime: '05',
    secondaryDateTime: '30',
    quaternaryDateTime: 'PM',
    thirdDescription: 'B-05-03 | New Campus',
    secondDescription: 'M. Reza Ganji',
    firstDescription: 'KS004-3-3-BAT-L-5',
    pass: false
  },
  ];
  constructor(
  ) { }

  ngOnInit() {

  }
}

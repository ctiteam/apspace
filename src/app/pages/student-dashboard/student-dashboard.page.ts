import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.page.html',
  styleUrls: ['./student-dashboard.page.scss'],
})
export class StudentDashboardPage implements OnInit {
  slideOpts = {
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    speed: 500,
  };
  constructor(
  ) { }

  ngOnInit() {
    
  }
}

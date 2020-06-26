import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-room-dashboard',
  templateUrl: './control-room-dashboard.page.html',
  styleUrls: ['./control-room-dashboard.page.scss'],
})
export class ControlRoomDashboardPage implements OnInit {
  today = new Date();
  classesChart = {
    type: 'line',
    options: {
      legend: {
        display: false,
      },
    },
    data: {
      labels: [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
      ],
      datasets: [
        {
          label: 'Classes',
          data: [200, 400, 50, 140, 190, 320, 122, 133, 168, 190, 100],
          borderColor: 'rgb(224, 20, 57, .7)',
          backgroundColor: 'rgb(224, 20, 57, .3)',
          fill: true,
        }
      ],
    }
  };

  usersChart = {
    type: 'line',
    options: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    data: {
      labels: [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
      ],
      datasets: [
        {
          label: 'Students',
          data: [ 50, 140, 190, 200, 400, 320, 122, 133, 168, 190, 100],
          borderColor: 'rgb(56, 128, 255, .7)',
          backgroundColor: 'rgb(56, 128, 255, .3)',
          fill: false,
        },
        {
          label: 'Staff',
          data: [190, 320, 122, 133, 168, 190, 100, 200, 400, 50, 140],
          borderColor: 'rgb(73, 181, 113, .7)',
          backgroundColor: 'rgb(73, 181, 113, .3)',
          fill: false,
        },
        {
          label: 'Visitors',
          data: [200, 400, 50, 140, 168, 190, 320, 122, 133, 190, 100],
          borderColor: 'rgb(227, 136, 39, .7)',
          backgroundColor: 'rgb(227, 136, 39, .3)',
          fill: false,
        },
      ],
    }
  };

  labChart = {
    type: 'horizontalBar',
    options: {
      legend: {
        display: false
      },
    },
    data: {
      labels: [
        'Level 1',
        'Level 3',
        'Level 4',
        'Level 5',
        'Level 6'
      ],
      datasets: [
        {
          label: 'Entries',
          data: [ 50, 140, 190, 200, 122 ],
          borderColor: ['rgb(56, 128, 255, .7)', 'rgb(73, 181, 113, .7)', 'rgb(227, 136, 39, .7)', 'rgb(138, 39, 204, .3)', 'rgb(227, 61, 27, .3)'],
          backgroundColor: ['rgb(56, 128, 255, .3)', 'rgb(73, 181, 113, .3)', 'rgb(227, 136, 39, .3)', 'rgb(138, 39, 204, .3)', 'rgb(227, 61, 27, .3)'],
        }
      ],
    }
  };
  constructor() { }

  ngOnInit() {
  }

}

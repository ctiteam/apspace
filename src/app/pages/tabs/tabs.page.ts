import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/interfaces/menu-item';
import { trigger, state, transition, keyframes, animate, style } from '@angular/animations';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  animations: [
    trigger('swing_me', [
      transition('false => true', [
        style({
          'transform-origin': 'top center',
          'animation-fill-mode': 'both'
        }),
        animate('1s', keyframes([
          style({ transform: 'rotate3d(0, 0, 1, 15deg)', offset: 0.2 }),
          style({ transform: 'rotate3d(0, 0, 1, -10deg)', offset: 0.4 }),
          style({ transform: 'rotate3d(0, 0, 1, 5deg)', offset: 0.6 }),
          style({ transform: 'rotate3d(0, 0, 1, -5deg)', offset: 0.8 }),
          style({ transform: 'rotate3d(0, 0, 1, 0deg)', offset: 1 }),
        ]))
      ])
    ])
  ]
})

export class TabsPage implements OnInit {
  selectedTab = 'student-dashboard';
  tabs: MenuItem[] = [
    {
      name: 'Timetable',
      path: 'student-timetable',
      icon: 'calendar'
    },
    {
      name: 'Attendance',
      path: 'attendance',
      icon: 'alarm'
    },
    {
      name: 'Dashboard',
      path: 'student-dashboard',
      icon: 'pulse'
    },
    {
      name: 'APCard',
      path: 'apcard',
      icon: 'card'
    },
    {
      name: 'More',
      path: '',
      icon: 'more'
    }
  ];

  constructor(private router: Router) { }

  tabChanged($event) {
    this.selectedTab = $event.tab;
  }

  ngOnInit() {
    this.selectedTab = this.router.url.split('/').pop();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-take-attendance',
  templateUrl: './take-attendance.page.html',
  styleUrls: ['./take-attendance.page.scss'],
})
export class TakeAttendancePage implements OnInit {

  params: Params;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.params = this.route.snapshot.params;
  }

}

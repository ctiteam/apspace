import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import gql from 'graphql-tag';

const initAttendance = gql`
  mutation initAttendance {
    initAttendance(schedule: "a") {
      schedule
      secret
      markedBy
      lecturer
      created
      modified
      startTime
      endTime
      validUntil
      expiredTime
      classCode
      classType
      students {
        userArn
        attendance
        lastModified
        modifiedBy
        internalIP
        externalIP
      }
    }
  }
`;

@Component({
  selector: 'app-take-attendance',
  templateUrl: './take-attendance.page.html',
  styleUrls: ['./take-attendance.page.scss'],
})
export class TakeAttendancePage implements OnInit {

  otp: string;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.otp = '123456';
    this.apollo.mutate({ mutation: initAttendance }).subscribe(console.log, console.error);
  }

}

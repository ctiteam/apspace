import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class AttendanceGQL extends Query {
  document = gql`
    query attendance($schedule: String!) {
      attendance(schedule: $schedule) {
        secret
        students {
          id
          name
          attendance
        }
      }
    }
  `;
}

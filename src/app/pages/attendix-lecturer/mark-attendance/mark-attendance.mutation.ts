import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class MarkAttendanceGQL extends Mutation {
  document = gql`
    mutation markAttendance($schedule: String! $student: String! $attendance: String!) {
      markAttendance(schedule: $schedule student: $student attendance: $attendance) {
        id
        schedule
      }
    }
  `;
}

import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class MarkAttendanceGQL extends Mutation {
  document = gql`
    mutation markAttendance($schedule: String! $otp: String! $student: String!) {
      markAttendance(schedule: $schedule otp: $otp student: $student) {
        name
        schedule
      }
    }
  `;
}

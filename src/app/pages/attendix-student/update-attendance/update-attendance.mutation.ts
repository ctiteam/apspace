import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UpdateAttendanceGQL extends Mutation {
  document = gql`
    mutation updateAttendance($schedule: String! $otp: String! $student: String!) {
      updateAttendance(schedule: $schedule otp: $otp student: $student) {
        id
        schedule
      }
    }
  `;
}

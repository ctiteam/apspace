import { Injectable } from '@angular/core';
import { Subscription } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class NewStatusGQL extends Subscription {
  document = gql`
    subscription NewStatus($schedule: String!) {
      newStatus(schedule: $schedule) {
        name
      }
    }
  `;
}

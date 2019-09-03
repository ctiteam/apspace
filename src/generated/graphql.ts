import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};




export type Attendance = {
   __typename?: 'Attendance',
  schedule: Scalars['String'],
  secret: Scalars['String'],
  markedBy: Scalars['String'],
  lecturer: Scalars['String'],
  created: Scalars['String'],
  modified?: Maybe<Scalars['String']>,
  startTime: Scalars['String'],
  endTime: Scalars['String'],
  validUntil: Scalars['String'],
  expiredTime: Scalars['Int'],
  classCode: Scalars['String'],
  classType?: Maybe<Scalars['String']>,
  students: Array<Status>,
};

export type Mutation = {
   __typename?: 'Mutation',
  initAttendance: Attendance,
  markAttendance: Status,
  updateAttendance: Status,
};


export type MutationInitAttendanceArgs = {
  ticket: Scalars['String'],
  schedule: Scalars['String']
};


export type MutationMarkAttendanceArgs = {
  ticket: Scalars['String'],
  schedule: Scalars['String'],
  student: Scalars['String'],
  attendance: Scalars['String']
};


export type MutationUpdateAttendanceArgs = {
  ticket: Scalars['String'],
  otp: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  attendance?: Maybe<Attendance>,
};


export type QueryAttendanceArgs = {
  schedule: Scalars['String']
};

export type Schema = {
   __typename?: 'schema',
  query?: Maybe<Query>,
  mutation?: Maybe<Mutation>,
  subscription?: Maybe<Subscription>,
};

export type Status = {
   __typename?: 'Status',
  id: Scalars['String'],
  name: Scalars['String'],
  userArn: Scalars['String'],
  attendance: Scalars['String'],
  lastModified: Scalars['String'],
  modifiedBy: Scalars['String'],
  internalIP: Scalars['String'],
  externalIP: Scalars['String'],
  schedule: Scalars['String'],
};

export type Subscription = {
   __typename?: 'Subscription',
  newStatus?: Maybe<Status>,
};


export type SubscriptionNewStatusArgs = {
  schedule: Scalars['String']
};
export type InitAttendanceMutationVariables = {
  ticket: Scalars['String'],
  schedule: Scalars['String']
};


export type InitAttendanceMutation = (
  { __typename?: 'Mutation' }
  & { attendance: (
    { __typename?: 'Attendance' }
    & Pick<Attendance, 'secret'>
    & { students: Array<(
      { __typename?: 'Status' }
      & Pick<Status, 'id' | 'name' | 'attendance'>
    )> }
  ) }
);

export const InitAttendanceDocument = gql`
    mutation initAttendance($ticket: String!, $schedule: String!) {
  attendance: initAttendance(ticket: $ticket, schedule: $schedule) {
    secret
    students {
      id
      name
      attendance
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InitAttendanceGQL extends Apollo.Mutation<InitAttendanceMutation, InitAttendanceMutationVariables> {
    document = InitAttendanceDocument;

  }
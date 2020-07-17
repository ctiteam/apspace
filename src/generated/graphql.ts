import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import { GraphQLModule } from 'src/app/graphql.module';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};




export type ScheduleInput = {
  classcode: Scalars['String'];
  date: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  classType: Scalars['String'];
};

export type LogInput = {
  lectureUpdate?: Maybe<Scalars['String']>;
  otherInfo?: Maybe<Scalars['String']>;
  nextLecturePlan?: Maybe<Scalars['String']>;
};

export type Attendance = {
  __typename?: 'Attendance';
  schedule: Schedule;
  secret: Scalars['String'];
  students: Array<Status>;
  log?: Maybe<Log>;
};

export type Schedule = {
  __typename?: 'Schedule';
  classcode: Scalars['String'];
  date: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  classType: Scalars['String'];
};

export type Status = {
  __typename?: 'Status';
  id: Scalars['String'];
  name: Scalars['String'];
  attendance: Scalars['String'];
  absentReason?: Maybe<Scalars['String']>;
  classcode: Scalars['String'];
  date: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  classType: Scalars['String'];
};

export type Log = {
  __typename?: 'Log';
  lectureUpdate?: Maybe<Scalars['String']>;
  otherInfo?: Maybe<Scalars['String']>;
  nextLecturePlan?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  attendance?: Maybe<Attendance>;
};


export type QueryAttendanceArgs = {
  schedule: ScheduleInput;
};

export type Mutation = {
  __typename?: 'Mutation';
  initAttendance: Attendance;
  initAttendanceAsPresent: Attendance;
  markAttendance: Status;
  markAttendanceAll: Array<Status>;
  saveLectureLog?: Maybe<Scalars['Boolean']>;
  resetAttendance?: Maybe<Scalars['Boolean']>;
  updateAttendance: Status;
};


export type MutationInitAttendanceArgs = {
  schedule: ScheduleInput;
  attendance?: Maybe<Scalars['String']>;
};


export type MutationInitAttendanceAsPresentArgs = {
  schedule: ScheduleInput;
  students: Array<Scalars['String']>;
};


export type MutationMarkAttendanceArgs = {
  schedule: ScheduleInput;
  student: Scalars['String'];
  attendance: Scalars['String'];
  absentReason?: Maybe<Scalars['String']>;
};


export type MutationMarkAttendanceAllArgs = {
  schedule: ScheduleInput;
  attendance: Scalars['String'];
};


export type MutationSaveLectureLogArgs = {
  schedule: ScheduleInput;
  log: LogInput;
};


export type MutationResetAttendanceArgs = {
  schedule: ScheduleInput;
};


export type MutationUpdateAttendanceArgs = {
  otp: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newStatus?: Maybe<Status>;
};


export type SubscriptionNewStatusArgs = {
  classcode: Scalars['String'];
  date: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  classType: Scalars['String'];
};

export type Schema = {
  __typename?: 'schema';
  query?: Maybe<Query>;
  mutation?: Maybe<Mutation>;
  subscription?: Maybe<Subscription>;
};

export type AttendanceQueryVariables = {
  schedule: ScheduleInput;
};


export type AttendanceQuery = (
  { __typename?: 'Query' }
  & { attendance?: Maybe<(
    { __typename?: 'Attendance' }
    & Pick<Attendance, 'secret'>
    & { students: Array<(
      { __typename?: 'Status' }
      & Pick<Status, 'id' | 'name' | 'attendance' | 'absentReason'>
    )>, log?: Maybe<(
      { __typename?: 'Log' }
      & Pick<Log, 'lectureUpdate' | 'otherInfo' | 'nextLecturePlan'>
    )> }
  )> }
);

export type InitAttendanceMutationVariables = {
  schedule: ScheduleInput;
  attendance: Scalars['String'];
};


export type InitAttendanceMutation = (
  { __typename?: 'Mutation' }
  & { attendance: (
    { __typename?: 'Attendance' }
    & Pick<Attendance, 'secret'>
    & { students: Array<(
      { __typename?: 'Status' }
      & Pick<Status, 'id' | 'name' | 'attendance' | 'absentReason'>
    )> }
  ) }
);

export type MarkAttendanceAllMutationVariables = {
  schedule: ScheduleInput;
  attendance: Scalars['String'];
};


export type MarkAttendanceAllMutation = (
  { __typename?: 'Mutation' }
  & { markAttendanceAll: Array<(
    { __typename?: 'Status' }
    & Pick<Status, 'id'>
  )> }
);

export type MarkAttendanceMutationVariables = {
  schedule: ScheduleInput;
  student: Scalars['String'];
  attendance: Scalars['String'];
  absentReason?: Maybe<Scalars['String']>;
};


export type MarkAttendanceMutation = (
  { __typename?: 'Mutation' }
  & { markAttendance: (
    { __typename?: 'Status' }
    & Pick<Status, 'id' | 'attendance' | 'absentReason' | 'classcode' | 'date' | 'startTime' | 'endTime' | 'classType'>
  ) }
);

export type NewStatusSubscriptionVariables = {
  classcode: Scalars['String'];
  date: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  classType: Scalars['String'];
};


export type NewStatusSubscription = (
  { __typename?: 'Subscription' }
  & { newStatus?: Maybe<(
    { __typename?: 'Status' }
    & Pick<Status, 'id' | 'attendance' | 'absentReason'>
  )> }
);

export type ResetAttendanceMutationVariables = {
  schedule: ScheduleInput;
};


export type ResetAttendanceMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'resetAttendance'>
);

export type SaveLectureLogMutationVariables = {
  schedule: ScheduleInput;
  log: LogInput;
};


export type SaveLectureLogMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'saveLectureLog'>
);

export type UpdateAttendanceMutationVariables = {
  otp: Scalars['String'];
};


export type UpdateAttendanceMutation = (
  { __typename?: 'Mutation' }
  & { updateAttendance: (
    { __typename?: 'Status' }
    & Pick<Status, 'id' | 'attendance' | 'classcode' | 'date' | 'startTime' | 'endTime' | 'classType'>
  ) }
);

export const AttendanceDocument = gql`
    query attendance($schedule: ScheduleInput!) {
  attendance(schedule: $schedule) {
    secret
    students {
      id
      name
      attendance
      absentReason
    }
    log {
      lectureUpdate
      otherInfo
      nextLecturePlan
    }
  }
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class AttendanceGQL extends Apollo.Query<AttendanceQuery, AttendanceQueryVariables> {
    document = AttendanceDocument;
    
  }
export const InitAttendanceDocument = gql`
    mutation initAttendance($schedule: ScheduleInput!, $attendance: String!) {
  attendance: initAttendance(schedule: $schedule, attendance: $attendance) {
    secret
    students {
      id
      name
      attendance
      absentReason
    }
  }
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class InitAttendanceGQL extends Apollo.Mutation<InitAttendanceMutation, InitAttendanceMutationVariables> {
    document = InitAttendanceDocument;
    
  }
export const MarkAttendanceAllDocument = gql`
    mutation markAttendanceAll($schedule: ScheduleInput!, $attendance: String!) {
  markAttendanceAll(schedule: $schedule, attendance: $attendance) {
    id
  }
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class MarkAttendanceAllGQL extends Apollo.Mutation<MarkAttendanceAllMutation, MarkAttendanceAllMutationVariables> {
    document = MarkAttendanceAllDocument;
    
  }
export const MarkAttendanceDocument = gql`
    mutation markAttendance($schedule: ScheduleInput!, $student: String!, $attendance: String!, $absentReason: String) {
  markAttendance(schedule: $schedule, student: $student, attendance: $attendance, absentReason: $absentReason) {
    id
    attendance
    absentReason
    classcode
    date
    startTime
    endTime
    classType
  }
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class MarkAttendanceGQL extends Apollo.Mutation<MarkAttendanceMutation, MarkAttendanceMutationVariables> {
    document = MarkAttendanceDocument;
    
  }
export const NewStatusDocument = gql`
    subscription NewStatus($classcode: String!, $date: String!, $startTime: String!, $endTime: String!, $classType: String!) {
  newStatus(classcode: $classcode, date: $date, startTime: $startTime, endTime: $endTime, classType: $classType) {
    id
    attendance
    absentReason
  }
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class NewStatusGQL extends Apollo.Subscription<NewStatusSubscription, NewStatusSubscriptionVariables> {
    document = NewStatusDocument;
    
  }
export const ResetAttendanceDocument = gql`
    mutation resetAttendance($schedule: ScheduleInput!) {
  resetAttendance(schedule: $schedule)
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class ResetAttendanceGQL extends Apollo.Mutation<ResetAttendanceMutation, ResetAttendanceMutationVariables> {
    document = ResetAttendanceDocument;
    
  }
export const SaveLectureLogDocument = gql`
    mutation saveLectureLog($schedule: ScheduleInput!, $log: LogInput!) {
  saveLectureLog(schedule: $schedule, log: $log)
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class SaveLectureLogGQL extends Apollo.Mutation<SaveLectureLogMutation, SaveLectureLogMutationVariables> {
    document = SaveLectureLogDocument;
    
  }
export const UpdateAttendanceDocument = gql`
    mutation updateAttendance($otp: String!) {
  updateAttendance(otp: $otp) {
    id
    attendance
    classcode
    date
    startTime
    endTime
    classType
  }
}
    `;

  @Injectable({
    providedIn: GraphQLModule
  })
  export class UpdateAttendanceGQL extends Apollo.Mutation<UpdateAttendanceMutation, UpdateAttendanceMutationVariables> {
    document = UpdateAttendanceDocument;
    
  }
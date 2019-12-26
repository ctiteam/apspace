import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentProfile } from '../interfaces';
import {
  MentorshipAttendance,
  MentorshipCourseDetail,
  MentorshipIntake,
  MentorshipResult,
  MentorshipSemesterSummary,
  MentorshipStudentList,
  MentorshipSubcourse
} from '../interfaces/mentorship';
import { WsApiService } from './ws-api.service';
@Injectable({
  providedIn: 'root'
})
export class MentorshipService {

  // devApi = 'https://gmywrxsd75.execute-api.ap-southeast-1.amazonaws.com/dev/mentor';

  constructor(
    private ws: WsApiService
  ) { }

  getStudents(): Observable<MentorshipStudentList[]> {
    return this.ws.get<MentorshipStudentList[]>('/mentor/student_list');
  }

  getStudentProfile(tp: string): Observable<StudentProfile> {
    return this.ws.get<StudentProfile>(`/mentor/student_profile?id=${tp}`);
  }

  getIntakes(tp: string): Observable<MentorshipIntake[]> {
    return this.ws.get<MentorshipIntake[]>(`/mentor/student_courses?id=${tp}`);
  }

  getStudentCourse(tp: string, intake: string): Observable<MentorshipCourseDetail[]> {
    return this.ws.get<MentorshipCourseDetail[]>(`/mentor/student_course_details?id=${tp}&intake=${intake}`);
  }

  getSubcourse(tp: string, intake: string): Observable<MentorshipSubcourse[]> {
    return this.ws.get<MentorshipSubcourse[]>(`/mentor/student_subcourses?id=${tp}&intake=${intake}`);
  }

  getSubcourseAssessment(tp: string, intake: string, module: string): Observable<MentorshipResult[]> {
    // tslint:disable-next-line: max-line-length
    return this.ws.get<MentorshipResult[]>(`/mentor/student_subcourse_assessment?id=${tp}&module_code=${module}&intake=${intake}`);
  }

  getSemesterSummary(tp: string, intake: string): Observable<MentorshipSemesterSummary[]> {
    return this.ws.get<MentorshipSemesterSummary[]>(`/mentor/sub_and_course_details?id=${tp}&intake=${intake}`);
  }

  getAttendance(tp: string, moduleCode: string, intake: string): Observable<MentorshipAttendance[]> {
    // tslint:disable-next-line: max-line-length
    return this.ws.get<MentorshipAttendance[]>(`/mentor/module_attendance_details?id=${tp}&module_code=${moduleCode}&intake=${intake}`);
  }
}

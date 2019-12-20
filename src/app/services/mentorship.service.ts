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

  apiUrl = 'https://gmywrxsd75.execute-api.ap-southeast-1.amazonaws.com/dev/mentor';

  constructor(
    private ws: WsApiService
  ) { }

  getStudents(): Observable<MentorshipStudentList[]> {
    return this.ws.get<MentorshipStudentList[]>('/student_list', { url: this.apiUrl });
  }

  getStudentProfile(tp: string): Observable<StudentProfile> {
    return this.ws.get<StudentProfile>(`/student_profile?id=${tp}`, { url: this.apiUrl });
  }

  getIntakes(tp: string): Observable<MentorshipIntake[]> {
    return this.ws.get<MentorshipIntake[]>(`/student_courses?id=${tp}`, { url: this.apiUrl });
  }

  getStudentCourse(tp: string, intake: string): Observable<MentorshipCourseDetail[]> {
    return this.ws.get<MentorshipCourseDetail[]>(`/student_course_details?id=${tp}&intake=${intake}`, { url: this.apiUrl });
  }

  getSubcourse(tp: string, intake: string): Observable<MentorshipSubcourse[]> {
    return this.ws.get<MentorshipSubcourse[]>(`/student_subcourses?id=${tp}&intake=${intake}`, { url: this.apiUrl });
  }

  getSubcourseAssessment(tp: string, intake: string, module: string): Observable<MentorshipResult[]> {
    // tslint:disable-next-line: max-line-length
    return this.ws.get<MentorshipResult[]>(`/student_subcourse_assessment?id=${tp}&module_code=${module}&intake=${intake}`, { url: this.apiUrl });
  }

  getSemesterSummary(tp: string, intake: string): Observable<MentorshipSemesterSummary[]> {
    return this.ws.get<MentorshipSemesterSummary[]>(`/sub_and_course_details?id=${tp}&intake=${intake}`, { url: this.apiUrl });
  }

  getAttendance(tp: string, moduleCode: string, intake: string): Observable<MentorshipAttendance[]> {
    // tslint:disable-next-line: max-line-length
    return this.ws.get<MentorshipAttendance[]>(`/module_attendance_details?id=${tp}&module_code=${moduleCode}&intake=${intake}`, { url: this.apiUrl });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentProfile } from '../interfaces';
import { Attendance, CourseDetail, Intake, Mentorship, Result, Subcourse } from '../interfaces/mentorship';
import { WsApiService } from './ws-api.service';
@Injectable({
  providedIn: 'root'
})
export class MentorshipService {

  apiUrl = 'https://gmywrxsd75.execute-api.ap-southeast-1.amazonaws.com/dev/mentor';

  constructor(
    private ws: WsApiService
  ) { }

  getStudents(): Observable<Mentorship[]> {
    return this.ws.get<Mentorship[]>('/student_list', { url: this.apiUrl });
  }

  getStudentPhoto(tp: string): Observable<any> {
    return this.ws.get<any>(`/student/photo?id=${tp}`, { url: this.apiUrl });
  }

  getStudentProfile(tp: string): Observable<StudentProfile> {
    return this.ws.get<StudentProfile>(`/student_profile?id=${tp}`, { url: this.apiUrl });
  }

  getIntakes(tp: string): Observable<Intake[]> {
    return this.ws.get<Intake[]>(`/student_courses?id=${tp}`, { url: this.apiUrl });
  }

  getStudentCourse(tp: string, intake: string): Observable<CourseDetail[]> {
    return this.ws.get<CourseDetail[]>(`/student_course_details?id=${tp}&intake=${intake}`, { url: this.apiUrl });
  }

  getSubcourse(tp: string, intake: string): Observable<Subcourse[]> {
    return this.ws.get<Subcourse[]>(`/student_subcourses?id=${tp}&intake=${intake}`, { url: this.apiUrl });
  }

  getSubcourseAssessment(tp: string, module: string): Observable<Result[]> {
    return this.ws.get<Result[]>(`/student_subcourse_assessment?id=${tp}&module_code=${module}`, { url: this.apiUrl });
  }

  getAttendance(tp: string, moduleCode: string, intake: string): Observable<Attendance[]> {
    // tslint:disable-next-line: max-line-length
    return this.ws.get<Attendance[]>(`/module_attendance_details?id=${tp}&module_code=${moduleCode}&intake=${intake}`, { url: this.apiUrl });
  }
}

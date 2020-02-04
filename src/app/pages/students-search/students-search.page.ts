import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  BeAPUStudentDetails, ClassificationLegend, Course, CourseDetails, DeterminationLegend,
  InterimLegend, MPULegend, StudentProfile, StudentSearch, Subcourse
} from 'src/app/interfaces';
import { CasTicketService, WsApiService } from 'src/app/services';

@Component({
  selector: 'app-students-search',
  templateUrl: './students-search.page.html',
  styleUrls: ['./students-search.page.scss'],
})
export class StudentsSearchPage implements OnInit {
  searchKeyword = '';
  searchResults = '';

  studentSelected = false;
  showResults = false;
  intakeSelected = false;

  skeletons = new Array(8);
  selectedIntake = '';

  studentsList$: Observable<StudentSearch[]>;
  studentProfile$: Observable<StudentProfile>;
  studentCourses$: Observable<Course[]>;
  studentsResults$: Observable<{ semester: string; value: Subcourse[]; }[]>;
  interimLegend$: Observable<InterimLegend[]>;
  mpuLegend$: Observable<MPULegend[]>;
  determinationLegend$: Observable<DeterminationLegend[]>;
  classificationLegend$: Observable<ClassificationLegend[]>;
  courseDetail$: Observable<CourseDetails>;
  studentDetails$: Observable<BeAPUStudentDetails[]>;

  devUrl = 'https://u1cd2ltoq6.execute-api.ap-southeast-1.amazonaws.com/dev/student';
  constructor(
    private ws: WsApiService,
    private cas: CasTicketService
  ) { }

  searchForStudents() {
    this.showResults = true;
    this.studentSelected = false;
    this.intakeSelected = false;
    this.searchResults = this.searchKeyword; // used for the error message
    // we need to get st for the service including the params (?id=)
    this.studentsList$ = this.cas.getST(`${this.devUrl}/search?id=${this.searchKeyword}`).pipe(
      switchMap((st) => {
        return this.ws.get<StudentSearch[]>(`/search?id=${this.searchKeyword}&ticket=${st}`,
          { url: this.devUrl, auth: false, attempts: 1 }
        );
      })
    ).pipe(
      tap(studentsList => {
        if (studentsList.length === 1) {
          this.getStudentProfile(studentsList[0]);
          this.getStudentCourses(studentsList[0]);
          this.showResults = false;
          this.studentSelected = true;
        }
      })
    );
  }

  getStudentData(student: StudentSearch) {
    this.intakeSelected = false;
    this.studentSelected = true;
    this.getStudentProfile(student);
    this.getStudentCourses(student);
  }

  getStudentProfile(student: StudentSearch) {
    // we need to get st for the service including the params (?id=)
    this.studentProfile$ = this.cas.getST(`${this.devUrl}/profile?id=${student.STUDENT_NUMBER}`).pipe(
      switchMap((st) => {
        return this.ws.get<StudentProfile>(`/profile?id=${student.STUDENT_NUMBER}&ticket=${st}`,
          { url: this.devUrl, auth: false, attempts: 1 }
        );
      })
    ).pipe(
      tap(res => console.log(res))
    );

    this.studentDetails$ = this.ws.post<BeAPUStudentDetails[]>('/student/image', {
      url: 'https://u1cd2ltoq6.execute-api.ap-southeast-1.amazonaws.com/dev',
      body: {
        id: [student.STUDENT_NUMBER]
      }
    });
  }

  getStudentCourses(student: StudentSearch) {
    console.log('courses called');
    // we need to get st for the service including the params (?id=)
    this.studentCourses$ = this.cas.getST(`${this.devUrl}/courses?id=${student.STUDENT_NUMBER}`).pipe(
      switchMap((st) => {
        return this.ws.get<any>(`/courses?id=${student.STUDENT_NUMBER}&ticket=${st}`,
          { url: this.devUrl, auth: false, attempts: 1 }
        );
      })
    );
  }


  getStudentResults(student: StudentSearch, intake: string) {
    this.intakeSelected = true;
    this.studentSelected = true;
    const url = `/student/subcourses?intake=${intake}&id=${student.STUDENT_NUMBER}`;

    this.studentsResults$ = forkJoin([
      this.ws.get<Subcourse>(url),
      this.getCourseDetails(intake, student)
    ]).pipe(
      map(([results, details]) => this.sortResult(results, details))
    );

    this.mpuLegend$ = this.ws.get<MPULegend[]>(`/student/mpu_legend?intake=${intake}&id=${student.STUDENT_NUMBER}`);
    this.determinationLegend$ = this.ws.get<DeterminationLegend[]>(`/student/determination_legend?intake=${intake}&id=${student.STUDENT_NUMBER}`);
    this.classificationLegend$ = this.ws.get<ClassificationLegend[]>(`/student/classification_legend?intake=${intake}&id=${student.STUDENT_NUMBER}`);
    this.interimLegend$ = this.ws.get<InterimLegend[]>(`/student/interim_legend?intake=${intake}&id=${student.STUDENT_NUMBER}`);
  }

  getCourseDetails(intake: string, student: StudentSearch): Observable<CourseDetails> {
    const url = `/student/sub_and_course_details?intake=${intake}&id=${student.STUDENT_NUMBER}`;
    return this.courseDetail$ = this.ws.get<CourseDetails>(url);
  }


  sortResult(results: any, courseSummary: any) {
    const resultBySemester = results
      .reduce((previous: any, current: any) => {
        if (!previous[current.SEMESTER]) {
          previous[current.SEMESTER] = [current];
        } else {
          previous[current.SEMESTER].push(current);
        }
        return previous;
      }, {});

    const summaryBySemester = courseSummary.reduce(
      (acc: any, result: any) => (
        (acc[result.SEMESTER] = (acc[result.SEMESTER] || []).concat(result)),
        acc
      ),
      {}
    );

    return Object.keys(resultBySemester).map(semester => ({
      semester,
      value: resultBySemester[semester] || [],
      summary: summaryBySemester[semester] || []
    }));
  }


  ngOnInit() {
  }


}

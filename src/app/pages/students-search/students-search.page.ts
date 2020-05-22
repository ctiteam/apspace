import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
export class StudentsSearchPage {
  searchKeyword = '';
  searchResults = '';

  studentSelected = false;
  showResults = false;
  intakeSelected = false;

  skeletons = new Array(8);
  selectedIntake = '';
  selectedStudentId = '';

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
  loading: HTMLIonLoadingElement;


  devUrl = 'https://u1cd2ltoq6.execute-api.ap-southeast-1.amazonaws.com/dev/student';
  prodUrl = 'https://api.apiit.edu.my/student';
  constructor(
    private ws: WsApiService,
    private cas: CasTicketService,
    private loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) { }

  searchForStudents() {
    this.showResults = true;
    this.studentSelected = false;
    this.intakeSelected = false;
    this.searchResults = this.searchKeyword; // used for the error message
    // we need to get st for the service including the params (?id=)
    this.studentsList$ = this.cas.getST(`${this.prodUrl}/search?id=${this.searchKeyword}`).pipe(
      switchMap((st) => {
        return this.ws.get<StudentSearch[]>(`/search?id=${this.searchKeyword}&ticket=${st}`,
          { url: this.prodUrl, auth: false, attempts: 1 }
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
    this.studentProfile$ = this.cas.getST(`${this.prodUrl}/profile?id=${student.STUDENT_NUMBER}`).pipe(
      switchMap((st) => {
        return this.ws.get<StudentProfile>(`/profile?id=${student.STUDENT_NUMBER}&ticket=${st}`,
          { url: this.prodUrl, auth: false, attempts: 1 }
        );
      })
    );

    this.studentDetails$ = this.ws.post<BeAPUStudentDetails[]>('/student/image', {
      body: {
        id: [student.STUDENT_NUMBER]
      }
    });
  }

  getStudentCourses(student: StudentSearch) {
    // we need to get st for the service including the params (?id=)
    this.studentCourses$ = this.cas.getST(`${this.prodUrl}/courses?id=${student.STUDENT_NUMBER}`).pipe(
      switchMap((st) => {
        return this.ws.get<any>(`/courses?id=${student.STUDENT_NUMBER}&ticket=${st}`,
          { url: this.prodUrl, auth: false, attempts: 1 }
        );
      })
    );
  }


  getStudentResults(student: StudentSearch, intake: string) {
    this.intakeSelected = true;
    this.studentSelected = true;
    this.selectedStudentId = student.STUDENT_NUMBER;
    this.selectedIntake = intake;
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

  generateTranscriptsPdf() {
    this.presentLoading();
    return forkJoin([
      this.requestInterimST(this.selectedStudentId, this.selectedIntake),
    ]).pipe(
      map(([serviceTickets]) => {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        // tslint:disable-next-line: max-line-length
        return this.http.post<any>('https://api.apiit.edu.my/interim-transcript/index.php', serviceTickets, { headers, responseType: 'text' as 'json' }).subscribe((response: string) => {
          catchError(err => {
            this.presentToast('Failed to generate: ' + err.message, 3000);
            return err;
          });

          if (response.startsWith('https://')) { // Only respond and do things if the response is a URL
            this.dismissLoading();
            this.iab.create(response, '_system', 'location=true');
            return;
          } else {

            this.dismissLoading();
            this.presentToast('Oops! Unable to generate PDF', 3000);
            return;
          }
        });
      })
    ).subscribe();
  }

  requestInterimST(studentId: string, intakeCode: string) {
    const api = 'https://api.apiit.edu.my';

    return forkJoin([
      this.cas.getST(api + `/student/courses?id=${studentId}`),
      this.cas.getST(api + '/student/subcourses'),
      this.cas.getST(api + '/student/interim_legend'),
      this.cas.getST(api + '/student/sub_and_course_details'),
      this.cas.getST(api + `/student/profile?id=${studentId}`),
      this.cas.getST(api + '/student/mpu_legend'),
      this.cas.getST(api + '/student/classification_legend'),
      this.cas.getST(api + '/student/su_legend'),
      this.cas.getST(api + '/student/determination_legend')
    ]).pipe(
      // tslint:disable-next-line: variable-name && tslint:disable-next-line: max-line-length
      map(([coursesST, subcoursesST, interim_legendST, sub_and_course_detailsST, profileST, mpu_legendST, classification_legendST, su_legendST, determination_legendST]) => {
        const payload = {
          intake: intakeCode,
          id: studentId,
          tickets: {
            courses: coursesST,
            subcourses: subcoursesST,
            interim_legend: interim_legendST,
            sub_and_course_details: sub_and_course_detailsST,
            profile: profileST,
            mpu_legend: mpu_legendST,
            classification_legend: classification_legendST,
            su_legend: su_legendST,
            determination_legend: determination_legendST,
          }
        };

        return payload;
      })
    );
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  async presentToast(msg: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration,
      color: 'medium',
      position: 'top',
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ],
    });

    toast.present();
  }



}

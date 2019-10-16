import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Role, StudentProfile } from 'src/app/interfaces';
import { SettingsService, WsApiService } from 'src/app/services';
import { ActivatedRoute } from 'src/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-submit-survey',
  templateUrl: './student-survey.page.html',
  styleUrls: ['./student-survey.page.scss'],
})
export class StudentSurveyPage implements OnInit {
  // TEMP VARIABLES
  stagingUrl = 'https://dl4h9zf8wj.execute-api.ap-southeast-1.amazonaws.com/dev/survey';
  todaysDate = new Date();

  // IF USER IS COMING FROM RESULTS PAGE
  userComingFromResultsPage = false;

  // NGMODEL VARIABLES
  intakeCode: string;
  classCode: string;
  courseType: string;
  surveyType: string;
  selectedModule: any;

  // LOADING & ERRORS VARIABLES
  numOfSkeletons = new Array(3);

  submitting = false;
  showFieldMissingError = false;

  // LISTS
  intakes: any[];
  modules: any;
  msqAnswers = [
    { id: '5', content: 'Strongly Agree' },
    { id: '4', content: 'Agree' },
    { id: '3', content: 'Neither' },
    { id: '2', content: 'Disagree' },
    { id: '1', content: 'Strongly Disagree' },
  ];
  response = {
    class_code: '',
    intake_code: '',
    survey_id: 0,
    answers: [
      {
        question_id: 0,
        content: '',
      },
    ],
  };
  // OBSERAVBLES
  survey$: Observable<any[]>;
  COURSE_CODE$: Observable<any[]>;
  COURSE_MODULES$: Observable<any[]>;
  navParams: any;

  constructor(
    public menu: MenuController,
    private ws: WsApiService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private settings: SettingsService,
    private iab: InAppBrowser,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.moduleCode) {

        this.userComingFromResultsPage = true;
        this.classCode = this.router.getCurrentNavigation().extras.state.moduleCode;
        this.intakeCode = this.router.getCurrentNavigation().extras.state.intakeCode;
      }
    });
    this.onInitData();
  }

  onInitData() {
    if (!this.userComingFromResultsPage) {
      // tslint:disable-next-line: no-bitwise
      if (this.settings.get('role') & Role.Student) {
        this.ws.get<StudentProfile>('/student/profile').subscribe(
          p => {
            this.intakeCode = p.INTAKE;
          },
          // tslint:disable-next-line: no-empty
          _ => { },
          () => {
            this.COURSE_CODE$ = this.getIntakes();
            this.onIntakeCodeChanged();
          },
        );
      }
    } else { // user coming from results page
      this.COURSE_CODE$ = this.getIntakes(); // get all of the intakes
      this.COURSE_MODULES$ = this.getModules(this.intakeCode).pipe( // get all of the modules
        tap(_ => {
          this.getModuleByClassCode(this.classCode); // get the details of the selected module
          this.surveyType = 'End-Semester'; // The only survey that will block results page is the end-semester survey
        }),
        tap(_ => this.getSurveys(this.intakeCode)) // get the survey for the intake (survey is for intake, not for module)
      );
    }
  }

  onIntakeCodeChanged() {
    let intakeStartsWith = '';
    intakeStartsWith = this.intakeCode.slice(0, 3);
    // tslint:disable-next-line: triple-equals
    if (intakeStartsWith == 'UCE' || intakeStartsWith == 'UCP') {
      this.courseType = 'APLC Students';
    } else if (intakeStartsWith === 'UCM') {
      this.courseType = 'masters';
    } else {
      this.courseType = 'bachelor';
    }
    console.log(this.courseType);
    this.COURSE_MODULES$ = this.getModules(this.intakeCode);
    this.classCode = '';
    this.surveyType = '';
  }

  onClassCodeChanged() {
    this.getSurveyType(this.classCode);
    this.getModuleByClassCode(this.classCode);
    this.showFieldMissingError = false;
  }

  getIntakes() {
    return this.ws.get<any>(`/intakes-list`, true, { url: this.stagingUrl }).pipe(
      tap()
    );
  }

  getModuleByClassCode(classCode: string) {
    this.modules.forEach(module => {
      if (module.CLASS_CODE === classCode) {
        this.selectedModule = module;
      }
    });
  }

  getModules(intakeCode: string) {
    return this.ws.get<any>(`/modules-list?intake_code=${intakeCode}`, true, { url: this.stagingUrl }).pipe(
      map(res => res.filter
        (item => !item.COURSE_APPRAISAL || (!item.COURSE_APPRAISAL2 && Date.parse(item.END_DATE) >
          Date.parse(this.todaysDate.toISOString())))),
      tap(res => this.modules = res),
      tap(res => {
      })
    );
  }

  getSurveys(intakeCode: string) {
    const answers = [];
    this.survey$ = this.ws.get<any>(`/surveys?intake_code=${intakeCode}`, true, { url: this.stagingUrl })
      .pipe(
        map(surveys => surveys.filter(survey => survey.type === this.surveyType)),
        tap(surveys => {
          for (const section of surveys[0].sections) {
            for (const question of section.questions) {
              answers.push({
                question_id: question.id,
                content: '',
              });
            }
          }
          this.response = {
            intake_code: this.intakeCode,
            class_code: this.classCode,
            survey_id: surveys[0].id,
            answers,
          };
        }),
      );
  }

  getSurveyType(classCode: string) {
    const todaysDate = new Date();
    this.modules.forEach(amodule => {
      if (classCode === amodule.CLASS_CODE) {
        if (!amodule.COURSE_APPRAISAL) { // student did not do end semester appraisal
          if (todaysDate > new Date(amodule.END_DATE)) { // appraisal should only appear when student finish the module
            this.surveyType = 'End-Semester';
          }
        }
        if (!amodule.COURSE_APPRAISAL2) { // student did not do mid-semester appraisal
          if (this.courseType === 'bachelor') { // bachelor students
            const moduleStartDate = new Date(amodule.START_DATE); // module start date
            const startDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 49)); // week 7 of the module
            const endDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 70)); // week 10 of the module
            if (todaysDate > startDateForMid && todaysDate < endDateForMid) {
              this.surveyType = 'Mid-Semester';
            }
          } else if (this.courseType === 'masters') {
            // do the masters logic here
          }
        }
        this.getSurveys(this.intakeCode);
      }
    });
  }

  getAnswerByQuestionId(id: number) {
    return this.response.answers.filter(answer => answer.question_id === id)[0];
  }

  async submitSurvey() {
    const confirm = await this.alertCtrl.create({
      header: 'Submit Survey',

      message: `You are about to submit the survey for the module with the code ${this.classCode},
       under the intake ${this.intakeCode}. Do you want to continue?`,
      buttons: [
        {
          text: 'No',
          // tslint:disable-next-line: no-empty
          handler: () => {
          },
        },
        {
          text: 'Yes',
          handler: () => {
            const notAnsweredQuestions = this.response.answers.filter(answer => answer.content === '');
            if (notAnsweredQuestions.length === 0) {
              this.submitting = true;

              this.ws.post('/response', { url: this.stagingUrl, body: this.response }).subscribe(
                {
                  error: err => {
                    this.toast(
                      `Something went wrong and we could not complete your request. Please try again or contact us via the feedback page`,
                      'danger');
                  },
                  complete: () => {
                    this.toast(`The survey for ${this.classCode} has been submitted successfully.`, 'success');
                    this.submitting = false;
                    this.classCode = '';
                    this.onInitData();
                  }
                }
              );
            } else {
              this.showFieldMissingError = true;
            }
          },
        },
      ],
    });
    await confirm.present();
  }

  async toast(msg: string, color: string) {
    const toast = await this.toastCtrl
      .create({
        message: msg,
        duration: 7000,
        color,
        position: 'bottom',
        showCloseButton: true,
      });
    toast.present();
  }
}

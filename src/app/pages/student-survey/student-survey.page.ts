import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, MenuController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Role, StudentProfile } from 'src/app/interfaces';
import { ActivatedRoute } from '@angular/router';
import { SettingsService, WsApiService } from 'src/app/services';

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
  // moduleCodeFromResultsPage = this.navParams.get('moduleCode');
  // intakeCodeFromResultsPage = this.navParams.get('intakeCode');
  // NGMODEL VARIABLES
  intakeCode: string;
  classCode: string;
  courseType: string;
  startSwith: string;
  surveyType: string;
  selectedModule: any;
  // LOADING & ERRORS VARIABLES
  numOfSkeletons = new Array(3);
  intakesAreLoading = false;
  modulesAreLoading = false;
  submitting = false;
  showFieldMissingError = false;
  studentIsMastersOrAPLC = false;
  // LISTS
  intakes: any[];
  modules: any;
  msqAnswers = [
    { id: '1', content: 'Strongly Disagree' },
    { id: '2', content: 'Disagree' },
    { id: '3', content: 'Neither' },
    { id: '4', content: 'Agree' },
    { id: '5', content: 'Strongly Agree' },
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
    public navCtrl: NavController,
    public menu: MenuController,
    private route: ActivatedRoute,
    private ws: WsApiService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private settings: SettingsService,
    private iab: InAppBrowser,
  ) { }

  ngOnInit() {
    this.onInitData();
  }

  onInitData() {

    // tslint:disable-next-line: no-bitwise
    if (this.settings.get('role') & Role.Student) {
      this.intakesAreLoading = true;
      this.ws.get<StudentProfile>('/student/profile').subscribe(
        p => {
          this.intakeCode = p.INTAKE;
        },
        // tslint:disable-next-line: no-empty
        _ => { },
        () => {
          this.startSwith = this.intakeCode.slice(0, 3);
          // tslint:disable-next-line: triple-equals
          if (this.startSwith == 'UCE' || this.startSwith == 'UCP') {
            this.studentIsMastersOrAPLC = true;
            this.courseType = 'APLC Students';
            this.iab.create('https://webapps.apiit.edu.my/engappraisal');
          } else {
            this.COURSE_CODE$ = this.getIntakes();
            this.courseType = 'bachelor';
            this.intakesAreLoading = false;

            this.COURSE_MODULES$ = this.getModules(this.intakeCode);
          }
        },
      );
    }
    // IF USER IS COMING FROM RESULTS PAGE
    // if (this.moduleCodeFromResultsPage) {
    //    this.getModules(this.intakeCodeFromResultsPage);
    // }
  }

  onIntakeCodeChanged() {
    this.COURSE_MODULES$ = this.getModules(this.intakeCode);
    this.classCode = '';
    this.surveyType = '';

  }

  onClassCodeChanged() {
    this.getSurveyType(this.classCode);
    this.getModuleByClassCode(this.classCode);
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
      tap()
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
        if (!amodule.COURSE_APPRAISAL) {
          if (todaysDate > new Date(amodule.END_DATE)) {
            this.surveyType = 'End-Semester';
          }
        }
        if (!amodule.COURSE_APPRAISAL2) {
          const moduleStartDate = new Date(amodule.START_DATE);
          const startDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 49));
          const endDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 70));
          if (todaysDate > startDateForMid && todaysDate < endDateForMid) {
            this.surveyType = 'Mid-Semester';
          }
        }
        this.getSurveys(this.intakeCode);
      }
    });
  }

  // USED FOR NAVIGATING DIRECTLY FROM RESULTS PAGE TO THIS PAGE
  getSurvey(intakeCode: string, moduleCode: string) {
    this.getSurveys(intakeCode);
    this.intakeCode = intakeCode;
    this.classCode = this.modules.filter(module => module.SUBJECT_CODE === moduleCode)[0].CLASS_CODE;
    this.surveyType = 'End-Semester';
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
            console.log(this.response);
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

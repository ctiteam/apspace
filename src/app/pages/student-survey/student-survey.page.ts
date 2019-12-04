import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SurveyIntake, SurveyModule } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-submit-survey',
  templateUrl: './student-survey.page.html',
  styleUrls: ['./student-survey.page.scss'],
})
export class StudentSurveyPage implements OnInit {
  // TEMP VARIABLES
  todaysDate = new Date();
  lecturerName = '';

  // IF USER IS COMING FROM RESULTS PAGE
  userComingFromResultsPage = false;

  // NGMODEL VARIABLES
  intakeCode: string;
  classCode: string;
  courseType: string;
  surveyType: string;
  selectedModule: SurveyModule;
  selectedIntake: SurveyIntake;

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
  COURSE_CODE$: Observable<SurveyIntake[]>;
  COURSE_MODULES$: Observable<SurveyModule[]>;
  navParams: any;

  constructor(
    public menu: MenuController,
    private ws: WsApiService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
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
      this.COURSE_CODE$ = this.getIntakes().pipe( // get all intakes
        tap(intakes => {
          if (intakes.length > 0) {
            const latestIntake = intakes[intakes.length - 1]; // select latest intake by default
            this.selectedIntake = latestIntake;
          }
        }),
        tap(_ => this.onIntakeCodeChanged()) // call intake changed
      );

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
    this.userComingFromResultsPage = false;
    this.courseType = this.selectedIntake.TYPE_OF_COURSE;
    this.intakeCode = this.selectedIntake.COURSE_CODE_ALIAS;

    this.COURSE_MODULES$ = this.getModules(this.intakeCode);
    this.classCode = ''; // empty class code
    this.surveyType = ''; // empty survey type

  }

  onClassCodeChanged() {
    this.userComingFromResultsPage = false;
    this.lecturerName = '';
    this.getSurveyType(this.classCode);
    this.getModuleByClassCode(this.classCode);
    this.showFieldMissingError = false;
  }

  getIntakes() {
    // tslint:disable-next-line: max-line-length
    return this.ws.get<SurveyIntake[]>(`/survey/intakes-list`);
  }
  getModuleByClassCode(classCode: string) {
    if (!this.userComingFromResultsPage) {
      this.modules.forEach(module => {
        if (module.CLASS_CODE === classCode) {
          this.selectedModule = module;
          this.ws.get(`/staff/listing?staff_username=${module.SAMACCOUNTNAME}`).subscribe(
            {
              next: (res: any) => {
                if (res.length > 0) {
                  this.lecturerName = res[0].FULLNAME;
                }
              }
            }
          );

        }
      });
    } else {
      this.modules.forEach(module => {
        if (module.SUBJECT_CODE === classCode) {
          this.selectedModule = module;
          this.classCode = module.CLASS_CODE;
          this.ws.get(`/staff/listing?staff_username=${module.SAMACCOUNTNAME}`).subscribe(
            {
              next: (res: any) => {
                if (res.length > 0) {
                  this.lecturerName = res[0].FULLNAME;
                }
              }
            }
          );

        }
      });
    }

  }

  getModules(intakeCode: string) {
    // tslint:disable-next-line: max-line-length
    return this.ws.get<SurveyModule[]>(`/survey/modules-list?intake_code=${intakeCode}`).pipe(
      map(res => res.filter
        (item =>
          !item.COURSE_APPRAISAL // user did not do end semester
          ||
          (
            !item.COURSE_APPRAISAL2 // user did not do mid-semester
            && Date.parse(item.END_DATE) > Date.parse(this.todaysDate.toISOString()) // todays date is less than end date of the module
          )
        )
      ),
      tap(res => this.modules = res),
      tap(res => {
        if (
          res.length === 0 // If user did all of the end semester surverys in the selected intake
          && !this.selectedIntake.PROGRAM_APPRAISAL // User did not do program survey and
          && Date.parse(this.selectedIntake.PROGRAM_APPRAISAL_DATE) < Date.parse(this.todaysDate.toISOString()) // Time for program survey
        ) {
          this.surveyType = 'Programme Evaluation';
          this.getSurveys(this.intakeCode);
        }
      })
    );
  }

  getSurveys(intakeCode: string) {
    const answers = [];
    this.survey$ = this.ws.get<any>(`/survey/surveys?intake_code=${intakeCode}`)
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
          if (this.courseType.includes('Level')) { // bachelor students
            const moduleStartDate = new Date(amodule.START_DATE); // module start date
            const startDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 49)); // week 7 of the module
            const endDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 70)); // week 10 of the module
            if (todaysDate >= startDateForMid && todaysDate < endDateForMid) { // week 10 is not included
              this.surveyType = 'Mid-Semester';
            }
          } else if (this.courseType.includes('Master')) { // masters students
            const moduleStartDate = new Date(amodule.START_DATE); // module start date
            if (amodule.STUDY_MODE === 'FullTime') { // full time student
              // tslint:disable-next-line: max-line-length
              const startDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 28)); // week 4 of the module
              const endDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 49)); // week 7 of the module
              if (todaysDate >= startDateForMid && todaysDate < endDateForMid) { // week 7 is not included
                this.surveyType = 'Mid-Semester';
              }
            } else {
              // tslint:disable-next-line: max-line-length
              const startDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 21)); // week 3 of the module
              const endDateForMid = new Date(new Date(amodule.START_DATE).setDate(moduleStartDate.getDate() + 42)); // week 6 of the module
              if (todaysDate >= startDateForMid && todaysDate < endDateForMid) { // week 6 is not included
                this.surveyType = 'Mid-Semester';
              }
            }
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
    let message = '';
    let endpoint = '';
    if (this.surveyType === 'Programme Evaluation') {
      message = `You are about to submit the programme survey for the intake ${this.intakeCode}. Do you want to continue?`;
      endpoint = '/survey/programme_response';
    } else {
      message = `You are about to submit the survey for the module with the code ${this.classCode},
      under the intake ${this.intakeCode}. Do you want to continue?`;
      endpoint = '/survey/response';
    }
    const confirm = await this.alertCtrl.create({
      header: 'Submit Survey',
      message,
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
              this.ws.post(endpoint, { body: this.response }).subscribe({
                error: (err) => {
                  if (err.status === 400) {
                    this.toast(
                      `Please make sure you answer all the questions`,
                      'danger');
                  } else {
                    // tslint:disable-next-line: max-line-length
                    this.toast(`Something went wrong and we could not complete your request. Please try again or contact us via the feedback page`, 'danger');
                  }
                  this.submitting = false;
                },
                complete: () => {
                  this.toast(`The survey has been submitted successfully.`, 'success');
                  this.submitting = false;
                  this.classCode = '';
                  this.onInitData();
                }
              });
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
        position: 'top',
        showCloseButton: true,
      });
    toast.present();
  }
}

import { Component } from "@angular/core";
import { IonicPage, MenuController, ToastController, AlertController, NavController, NavParams } from "ionic-angular";
import { Observable } from "rxjs";
import { WsApiProvider } from "../../../providers";
import { tap, map } from "rxjs/operators";

@IonicPage()
@Component({
  selector: "page-submit-survey",
  templateUrl: "submit-survey.html",
})
export class SubmitSurveyPage {
  // TEMP VARIABLES 
  stagingUrl = 'https://dl4h9zf8wj.execute-api.ap-southeast-1.amazonaws.com/dev/survey';

  todaysDate = new Date();
  
  // IF USER IS COMING FROM RESULTS PAGE
  moduleCodeFromResultsPage = this.navParams.get('moduleCode');
  intakeCodeFromResultsPage = this.navParams.get('intakeCode');

  // NGMODEL VARIABLES
  intakeCode: string;
  classCode: string;
  surveyType: string;


  // LOADING VARIABLES
  numOfSkeletons = new Array(3);
  intakesAreLoading = false;
  modulesAreLoading = false;
  submitting = false;

  // LISTS
  intakes: any[];
  modules: any;
  surveyTypes: string[] = [];
  msqAnswers = [
    { id: '1', content: 'Strongly Disagree' },
    { id: '2', content: 'Disagree' },
    { id: '3', content: 'Neither' },
    { id: '4', content: 'Agree' },
    { id: '5', content: 'Strongly Agree' }
  ]
  response = {
    'class_code': '',
    'intake_code': '',
    'survey_id': 0,
    'answers': [
      {
        'question_id': 0,
        'content': ''
      }
    ]
  };

  // OBSERAVBLES
  survey$: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    private ws: WsApiProvider,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public navParams: NavParams
    ) { }

  ionViewDidLoad() {
    this.getIntakes();
    // IF USER IS COMING FROM RESULTS PAGE    
    if(this.moduleCodeFromResultsPage){
      this.getModules(this.intakeCodeFromResultsPage);
    }
  }

  // TOGGLE THE MENU
  toggleFilterMenu() {
    this.menu.toggle();
  }


  onIntakeCodeChanged() {
    this.getModules(this.intakeCode);
    this.classCode = '';
    this.surveyType = '';
  }

  onClassCodeChanged() {
    this.getSurveyTypes(this.classCode);
    this.surveyType = '';
  }

  onSurveyTypeChanged() {
    this.getSurveys(this.intakeCode);
    this.toggleFilterMenu();
  }

  getIntakes() {
    this.intakesAreLoading = true;
    this.ws.get<any>(`/intakes-list`, true, { url: this.stagingUrl }).subscribe(
      res => this.intakes = res,
      _ => { },
      () => this.intakesAreLoading = false
    );
  }

  getModules(intakeCode: string) {
    this.modulesAreLoading = true;
    this.ws.get<any>(`/modules-list?intake_code=${intakeCode}`, true, { url: this.stagingUrl }).pipe(
      map(res => res.filter(item => !item.COURSE_APPRAISAL || (!item.COURSE_APPRAISAL2 && Date.parse(item.END_DATE) > Date.parse(this.todaysDate.toISOString())))),
    ).subscribe(
      res => this.modules = res,
      _ => {
        this.modulesAreLoading = false;
      },
      () => {
        this.modulesAreLoading = false;
        // USER COMING FROM RESULTS PAGE, AND MODULES ARE READY
        if(this.moduleCodeFromResultsPage){
          this.getSurvey(this.intakeCodeFromResultsPage, this.moduleCodeFromResultsPage);
        }
      }
    );
  }

  getSurveys(intakeCode: string) {
    let answers =  [];    
    this.survey$ = this.ws.get<any>(`/surveys?intake_code=${intakeCode}`, true, { url: this.stagingUrl })
      .pipe(
        map(surveys => surveys.filter(survey => survey.type === this.surveyType)),
        tap(surveys => {
          for(let section of surveys[0].sections){
            for (let question of section.questions){
              answers.push({
                question_id: question.id,
                content: ''
              })
            }
          }
          this.response = {
            intake_code: this.intakeCode,
            class_code: this.classCode,
            survey_id: surveys[0].id,
            answers: answers
          }
        })
      );
  }

  getSurveyTypes(classCode: string) {
    this.surveyTypes = [];
    this.modules.filter(item => {
      if (classCode === item.CLASS_CODE) {
        if (!item.COURSE_APPRAISAL) {
          this.surveyTypes.push('End-Semester');
        }
        if (!item.COURSE_APPRAISAL2) {
          this.surveyTypes.push('Mid-Semester');
        }
      }
    });
  }

  // USED FOR NAVIGATING DIRECTLY FROM RESULTS PAGE TO THIS PAGE
  getSurvey(intakeCode: string, moduleCode: string) {
    this.getSurveys(intakeCode);
    this.intakeCode = intakeCode;
    this.classCode = this.modules.filter(module => module.SUBJECT_CODE === moduleCode)[0].CLASS_CODE
    this.surveyType = 'End-Semester';
  }

  getAnswerByQuestionId(id: number){
    return this.response.answers.filter(answer => answer.question_id === id)[0];
  }

  submitSurvey() {
    const confirm = this.alertCtrl.create({
      title: 'Submit Survey',
      message: `You are about to submit the survey for the module with the code ${this.classCode}, under the intake ${this.intakeCode}. Do you want to continue?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.submitting = true;
            this.ws.post('/response', { url: this.stagingUrl, body: this.response }).subscribe(
              _ => { },
              err => {
                this.toast("Something went wrong and we couldn't complete your request. Please try again or contact us via the feedback page");
              },
              () => {
                this.toast(`The survey for ${this.classCode} has been submitted successfully.`);
                this.navCtrl.pop();
                this.submitting = false;
              }
            );
          }
        }
      ]
    });
    confirm.present();
  }

  toast(msg: string) {
    this.toastCtrl
      .create({
        message: msg,
        duration: 7000,
        position: "bottom",
        showCloseButton: true
      })
      .present();
  }

  // updateSurvey(studentBehaviors: AplcStudentBehaviour[]) {
  //   const confirm = this.alertCtrl.create({
  //     title: 'Update Students Details',
  //     message: `You are about to update students details. Do you want to continue?`,
  //     buttons: [
  //       {
  //         text: 'No',
  //         handler: () => {
  //         }
  //       },
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           this.showLoading = true;
  //           this.ws.put('/student-behavior', { url: this.stagingUrl, body: studentBehaviors }).subscribe(
  //             _ => { },
  //             err => {
  //               this.toast("Something went wrong and we couldn't complete your request. Please try again or contact us via the feedback page");
  //             },
  //             () => {
  //               this.toast("Students information has been updated successfully.");
  //               this.navCtrl.pop();
  //               this.showLoading = false;
  //             }
  //           );
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }

  // toast(msg: string) {
  //   this.toastCtrl
  //     .create({
  //       message: msg,
  //       duration: 7000,
  //       position: "bottom",
  //       showCloseButton: true
  //     })
  //     .present();
  // }
}

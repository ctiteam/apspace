import { Component } from "@angular/core";
import { IonicPage, MenuController, ToastController, AlertController, NavController } from "ionic-angular";
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

  // NGMODEL VARIABLES
  intakeCode: string;
  moduleCode: string;
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

  constructor(public navCtrl: NavController, public menu: MenuController, private ws: WsApiProvider, private toastCtrl: ToastController, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    this.getIntakes();
  }

  // TOGGLE THE MENU
  toggleFilterMenu() {
    this.menu.toggle();
  }


  onIntakeCodeChanged() {
    this.getModules(this.intakeCode);
    this.moduleCode = '';
    this.surveyType = '';
  }

  onModuleCodeChanged() {
    this.getSurveyTypes(this.moduleCode);
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
      }
    );
  }

  getSurveys(intakeCode: string) {
    let answers =  [];
    this.survey$ = this.ws.get<any>(`/surveys?intake_code=${intakeCode}`, true, { url: this.stagingUrl })
      .pipe(
        map(surveys => surveys.filter(survey => survey.type === this.surveyType)),
        tap(surveys => {
          // console.log(surveys[0].sections);
          for(let section of surveys[0].sections){
          // console.log('Hi sec');   
            for (let question of section.questions){
              // console.log('Hi ques');   
              answers.push({
                question_id: question.id,
                content: ''
              })
            }
          }
          this.response = {
            intake_code: this.intakeCode,
            class_code: this.moduleCode,
            survey_id: surveys[0].id,
            answers: answers
          }
        }),
        tap(_ => console.log(this.response))
      );
  }

  getSurveyTypes(moduleCode: string) {
    this.surveyTypes = [];
    this.modules.filter(item => {
      if (moduleCode === item.SUBJECT_CODE) {
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
    this.moduleCode = moduleCode;
    this.surveyType = 'End-Semester';
  }

  // getQuestionIndexById(id: number){
  //   console.log(this.response.answers.indexOf(this.response.answers.filter(answer => answer.question_id = id)[0]));
  //   return this.response.answers.indexOf(this.response.answers.filter(answer => answer.question_id = id)[0]);
  // }

  submitSurvey(surveyId: number) {
    const confirm = this.alertCtrl.create({
      title: 'Submit Survey',
      message: `You are about to submit the survey for the module with the code ${this.moduleCode}, under the intake ${this.intakeCode}. Do you want to continue?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // this.submitting = true;
            // this.ws.post('/response', { url: this.stagingUrl, body: studentBehaviors }).subscribe(
            //   _ => { },
            //   err => {
            //     this.toast("Something went wrong and we couldn't complete your request. Please try again or contact us via the feedback page");
            //   },
            //   () => {
            //     this.toast(`The survey for ${this.moduleCode} has been submitted successfully.`);
            //     this.navCtrl.pop();
            //     this.submitting = false;
            //   }
            // );
            console.log(this.response);
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

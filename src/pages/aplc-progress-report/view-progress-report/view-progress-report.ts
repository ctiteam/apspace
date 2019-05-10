
import { Component } from "@angular/core";
import { IonicPage, MenuController } from "ionic-angular";
import { WsApiProvider } from "../../../providers";
import { Observable } from "rxjs";
import { AplcClassDescription, AplcStudentBehaviour } from "../../../interfaces";
import { tap } from "rxjs/operators";


@IonicPage()
@Component({
  selector: "page-view-progress-report",
  templateUrl: "view-progress-report.html",
})
export class ViewProgressReportPage {
  stagingUrl = 'https://kh1rvo4ilf.execute-api.ap-southeast-1.amazonaws.com/dev/aplc';
  objectKeys = Object.keys; // USED FOR GROUPING TRANSACTIONS PER MONTH

  subject: string;
  classCode: string;

  numOfSkeletons = new Array(3);

  showSubjectLoading = false;
  showClassCodeLoading = false;
  showNoSubjectsMessage = false;

  subjects: string[];
  classes: [{
    CLASS_CODE: string,
    LECTURER_NAME: string
  }];

  classDescription$: Observable<AplcClassDescription[]>;
  studentsBehaviour$: Observable<AplcStudentBehaviour[]>;
  descriptionLegend$: Observable<any>;
  scoreLegend$: Observable<any>;


  constructor(public menu: MenuController, private ws: WsApiProvider) { }

  ionViewDidLoad() {
    this.getSubjects();
    this.getScoreLegend();
    this.getDescriptionLegend();
  }

  // TOGGLE THE MENU
  toggleFilterMenu() {
    this.menu.toggle();
  }

  onSubjectChanged() {
    this.getClasses(this.subject);
  }

  onClassCodeChanged() {
    this.getClassDescription(this.classCode);
    this.getStudentsBehaviour(this.classCode);
    this.toggleFilterMenu();
  }

  getSubjects() {
    this.showSubjectLoading = true;
    this.ws.get<any>(`/subjects`, true, { url: this.stagingUrl }).subscribe(
      res => this.subjects = res,
      _ => {},
      () => {
        this.showSubjectLoading = false
        if(this.subjects.length === 0){
          this.showNoSubjectsMessage = true;
        }
      }
    );
  }

  getClasses(subjectCode: string) {
    this.showClassCodeLoading = true;
    this.ws.get<any>(`/classes?subject_code=${subjectCode}`, true, { url: this.stagingUrl }).subscribe(
      res => this.classes = res,
      _ => {},
      () => this.showClassCodeLoading = false
    );
  }

  getClassDescription(classCode: string) {
    this.classDescription$ = this.ws.get<AplcClassDescription[]>(`/class-description?class_code=${classCode}`, true, { url: this.stagingUrl });
  }

  getStudentsBehaviour(classCode: string) {
    this.studentsBehaviour$ = this.ws.get<AplcStudentBehaviour[]>(`/student-behavior?class_code=${classCode}`, true, { url: this.stagingUrl });
  }

  getScoreLegend() {
    this.scoreLegend$ = this.ws.get<any[]>(`/score-legend`, true, { url: this.stagingUrl });
  }

  getDescriptionLegend() {
    this.descriptionLegend$ = this.ws.get<any[]>(`/description-legend`, true, { url: this.stagingUrl }).pipe(tap(data => console.log(data)
    ));
  }
}

import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Observable, Subject } from "rxjs";
import { StudentConsentProfile } from "../../interfaces";
import { WsApiProvider } from "../../providers";
import { catchError, tap } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@IonicPage()
@Component({
  selector: "page-student-consent-form",
  templateUrl: "student-consent-form.html"
})
export class StudentConsentFormlPage {
  student: StudentConsentProfile;
  studentData: StudentConsentProfile;
  searchKeyword: string;
  userSearched = false;
  userAuthorized = true;
  authorizedError$ = new Subject<boolean>();
  searching = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ws: WsApiProvider
  ) { }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    if (this.searchKeyword) {
      console.log(this.searchKeyword);
      this.searchForStudent();
    }
  }

  searchForStudent() {
    this.searching = true;
    let url = "https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com/dev";
    if (this.searchKeyword || this.searchKeyword !== "") {
      this.userSearched = true;
      this.ws.get<StudentConsentProfile>(
        `/staff/consent/student_profile/${this.searchKeyword.toUpperCase()}`,
        true,
        { url: url, attempts: 1, returnError: true }
      ).subscribe(
        data => this.student = data[0],
        (error$: Observable<any>) => {
          error$.subscribe(
            error => {
              if (error.status === 401) {
                this.userAuthorized = false;
              }
              this.searching = false;
            }
          );
        },
        () => {
          this.searching = false;
        }
      );
    } else {
      this.userSearched = true;
    }
  }

  openEditFormPage() {
    this.navCtrl.push("StudentConsentFormEditPage", {
      studentData: this.student
    });
  }
}

import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { StudentConsentProfile } from "../../interfaces";
import { Observable } from "rxjs";
import { WsApiProvider } from "../../providers";

@IonicPage()
@Component({
  selector: "page-student-consent-form-edit",
  templateUrl: "student-consent-form-edit.html"
})
export class StudentConsentFormEditPage {
  studentConsentForm = <StudentConsentProfile>{};
  student$: Observable<StudentConsentProfile> = this.navParams.get(
    "studentData"
  );
  constructor(public navCtrl: NavController, public navParams: NavParams, private ws: WsApiProvider) {
    this.student$.subscribe(
      data => {
        this.studentConsentForm = data[0];
      }
    );
  }

  submitForm() {
    const headers = { 'Content-Type': 'application/json' };
    let urlTest = 'https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com/dev';
    this.ws.post(`/staff/consent/student_profile/update/${this.studentConsentForm.STUDENT_ID}`, { headers: headers, body: this.studentConsentForm, url: urlTest }).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }

  ionViewDidLoad() { }
}

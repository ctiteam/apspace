import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Observable } from "rxjs";
import { StudentConsentProfile } from "../../interfaces";
import { WsApiProvider } from "../../providers";

@IonicPage()
@Component({
  selector: "page-student-consent-form",
  templateUrl: "student-consent-form.html"
})
export class StudentConsentFormlPage {
  student$: Observable<StudentConsentProfile>;
  studentData: StudentConsentProfile;
  searchKeyword;
  userSearched = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ws: WsApiProvider
  ) {}

  ionViewDidLoad() {}

  searchForStudent() {
    let url = "https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com/dev";
    if (this.searchKeyword || this.searchKeyword !== "") {
      this.userSearched = true;
      this.student$ = this.ws.get<StudentConsentProfile>(
        `/staff/consent/student_profile/${this.searchKeyword}`,
        true,
        { url: url }
      );
    } else {
      this.userSearched = true;
    }
  }

  openEditFormPage() {
    this.navCtrl.push("StudentConsentFormEditPage", {
      studentData: this.student$
    });
  }
}

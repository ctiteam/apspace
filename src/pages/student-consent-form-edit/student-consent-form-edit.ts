import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { StudentConsentProfile } from "../../interfaces";
import { Observable } from "rxjs";

@IonicPage()
@Component({
  selector: "page-student-consent-form-edit",
  templateUrl: "student-consent-form-edit.html"
})
export class StudentConsentFormEditPage {
  student$: Observable<StudentConsentProfile> = this.navParams.get(
    "studentData"
  );
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {}
}

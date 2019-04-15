import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, AlertController } from "ionic-angular";
import { StudentConsentProfile } from "../../interfaces";
import { Observable } from "rxjs";
import { WsApiProvider } from "../../providers";

// UPDATE THE APIS BEFORE PUSH TO PRODUCTION
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private ws: WsApiProvider, private toastCtrl: ToastController, public alertCtrl: AlertController) {
    this.student$.subscribe(
      data => {
        this.studentConsentForm = data[0];
      }
    );
  }

  submitForm() {
    const confirm = this.alertCtrl.create({
      title: 'Update Security Questions',
      message: `You are about to update the information for ${this.studentConsentForm.STUDENT_NAME}. Do you want to continue?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const headers = { 'Content-Type': 'application/json' };
            let urlTest = 'https://ztmu4mdu21.execute-api.ap-southeast-1.amazonaws.com/dev';
            this.ws.post(`/staff/consent/student_profile/update/${this.studentConsentForm.STUDENT_ID}`, { headers: headers, body: this.studentConsentForm, url: urlTest }).subscribe(
              _ => { },
              _ => { 
                this.toast("Something went wrong and we couldn't complete your request. Please try again or contact us via the feedback page");
              },
              () => {
                this.toast("Students information has been updated successfully.")
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

  ionViewDidLoad() { }
}

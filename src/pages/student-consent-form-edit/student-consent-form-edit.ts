import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, AlertController } from "ionic-angular";
import { StudentConsentProfile } from "../../interfaces";
import { Observable } from "rxjs";
import { WsApiProvider } from "../../providers";
import { FormGroup, FormControl, Validators } from "@angular/forms";

// UPDATE THE APIS BEFORE PUSH TO PRODUCTION
@IonicPage()
@Component({
  selector: "page-student-consent-form-edit",
  templateUrl: "student-consent-form-edit.html"
})
export class StudentConsentFormEditPage {
  realtionships = ["Father", "Mother", "Uncle", "Aunty", "Brother",
    "Sister", "Husband", "Wife", "Guardian", "Other"];
  consentForm: FormGroup;

  phoneValidationRegularExp = /^(?:00|\+)[0-9\d./\- ]{6,14}$/;
  // THIS REGULAR EXPERSSION FOLLOWS THE RFC 2822 STANDARD
  emailValidationRegularExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

  studentConsentForm: StudentConsentProfile = this.navParams.get(
    "studentData"
  );
  constructor(public navCtrl: NavController, public navParams: NavParams, private ws: WsApiProvider, private toastCtrl: ToastController, public alertCtrl: AlertController) {

    this.initForm();
  }

  submitForm() {
    const confirm = this.alertCtrl.create({
      title: 'Update Student Details',
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
                this.toast("Students information has been updated successfully.");
                this.navCtrl.pop();
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


  initForm() {
    this.consentForm = new FormGroup({

      STUDENT_NAME: new FormControl(this.studentConsentForm.STUDENT_NAME, Validators.required),
      STUDENT_ID: new FormControl(this.studentConsentForm.STUDENT_ID, Validators.required),
      MOBILE_TEL_NO: new FormControl(this.studentConsentForm.MOBILE_TEL_NO, [Validators.required, Validators.pattern(this.phoneValidationRegularExp)]),
      E_MAIL: new FormControl(this.studentConsentForm.E_MAIL, [Validators.required, Validators.pattern(this.emailValidationRegularExp)]),
      SCHOLARSHIP: new FormControl(this.studentConsentForm.SCHOLARSCHIP),
      STUDENT_STATUS: new FormControl(this.studentConsentForm.STUDENT_STATUS, Validators.required),

      PARENTS_NAME: new FormControl(this.studentConsentForm.PARENTS_NAME, Validators.required),
      PARENTS_RELATIONSHIP: new FormControl(this.studentConsentForm.PARENTS_RELATIONSHIP, Validators.required),
      PARENTS_RESIDENTIAL_ADDRESS: new FormControl(this.studentConsentForm.PARENTS_RESIDENTIAL_ADDRESS, Validators.required),
      PARENTS_RESIDENTIAL_CITY: new FormControl(this.studentConsentForm.PARENTS_RESIDENTIAL_CITY, Validators.required),
      PARENTS_RESIDENTIAL_POSTCODE: new FormControl(this.studentConsentForm.PARENTS_RESIDENTIAL_POSTCODE),
      PARENTS_RESIDENTIAL_STATE: new FormControl(this.studentConsentForm.PARENTS_RESIDENTIAL_STATE),
      PARENTS_RESIDENTIAL_COUNTRY: new FormControl(this.studentConsentForm.PARENTS_RESIDENTIAL_COUNTRY, Validators.required),
      PARENTS_MOBILE_TEL: new FormControl(this.studentConsentForm.PARENTS_MOBILE_TEL, [Validators.required, Validators.pattern(this.phoneValidationRegularExp)]),
      PARENTS_EMAIL: new FormControl(this.studentConsentForm.PARENTS_EMAIL, Validators.pattern(this.emailValidationRegularExp)),

      GUARDIAN_NAME: new FormControl(this.studentConsentForm.GUARDIAN_NAME),
      GUARDIAN_RELATIONSHIP: new FormControl(this.studentConsentForm.GUARDIAN_RELATIONSHIP),
      GUARDIAN_RESIDENTIAL_ADDRESS: new FormControl(this.studentConsentForm.GUARDIAN_RESIDENTIAL_ADDRESS),
      GUARDIAN_RESIDENTIAL_CITY: new FormControl(this.studentConsentForm.GUARDIAN_RESIDENTIAL_CITY),
      GUARDIAN_RESIDENTIAL_POSTCODE: new FormControl(this.studentConsentForm.GUARDIAN_RESIDENTIAL_POSTCODE),
      GUARDIAN_RESIDENTIAL_STATE: new FormControl(this.studentConsentForm.GUARDIAN_RESIDENTIAL_STATE),
      GUARDIAN_RESIDENTIAL_COUNTRY: new FormControl(this.studentConsentForm.GUARDIAN_RESIDENTIAL_COUNTRY),
      GUARDIAN_MOBILE_TEL: new FormControl(this.studentConsentForm.GUARDIAN_MOBILE_TEL, Validators.pattern(this.phoneValidationRegularExp)),
      GUARDIAN_EMAIL: new FormControl(this.studentConsentForm.GUARDIAN_EMAIL, Validators.pattern(this.emailValidationRegularExp)),
    });
  }

  ionViewDidLoad() { }
}

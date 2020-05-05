import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import { SearchModalComponent } from 'src/app/components/search-modal/search-modal.component';
import { IntakeExamSchedule } from 'src/app/interfaces/exam-schedule-admin';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-add-intake',
  templateUrl: './add-intake.page.html',
  styleUrls: ['./add-intake.page.scss'],
})
export class AddIntakePage implements OnInit {
  @Input() onEdit: boolean;
  @Input() intakeDetails: IntakeExamSchedule;
  @Input() examId: any;
  @Input() intakesToBeValidated: any;

  loading: HTMLIonLoadingElement;

  devUrl = 'https://jeioi258m1.execute-api.ap-southeast-1.amazonaws.com/dev';

  intakeForm: FormGroup;
  intakes = [];

  venues = [
    'APITT@EXAM HALL',
    'APU@EXAM HALL',
    'Microsoft Teams(Online)'
  ];

  types = [
    'First',
    'Resit'
  ];

  constructor(
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.ws.get<any>('/exam/intake_listing', { url: this.devUrl }).pipe(
      tap(intakes => {
        intakes.forEach(intake => this.intakes.push(intake.COURSE_CODE_ALIAS));
      })
    ).subscribe();

    this.initializeForm(this.intakeDetails);
  }

  initializeForm(intakeDetails: IntakeExamSchedule = {
    DOCKETSDUE: '',
    ENTRYID: '',
    INTAKE: '',
    RESULT_DATE: '',
    TYPE: '',
    VENUE: ''
  }) {
    let splitVenue;
    let location = '';
    let venue = '';

    if (this.onEdit && intakeDetails.VENUE) {
      splitVenue = intakeDetails.VENUE.split(',');
      location = splitVenue[0];
      venue = splitVenue[1];
    }

    this.intakeForm = this.formBuilder.group({
      intake: this.initializeIntake(intakeDetails.INTAKE),
      type: [intakeDetails.TYPE],
      location: [location],
      venue: [venue, Validators.required],
      docketIssuance: [intakeDetails.DOCKETSDUE],
      examResultDate: [intakeDetails.RESULT_DATE, Validators.required]
    });
  }

  initializeIntake(intake) {
    if (!(this.onEdit)) {
      return this.formBuilder.array([], [Validators.required]);
    } else {
      return [intake, Validators.required];
    }
  }

  async presentIntakeSearch() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.intakes,
        notFound: 'No intake selected'
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.item) {
        if (this.intakesToBeValidated.includes(data.data.item) || this.intakeArray.value.includes(data.data.item)) {
          this.showToastMessage(
            'You cannot create duplicate intakes entry with the same intake.',
            'danger'
          );
          return;
        }

        if (this.onEdit) {
          this.intakeForm.get('intake').patchValue(data.data.item);
        } else {
          this.intakeArray.push(this.formBuilder.control(data.data.item));
        }
      }
    });

    return await modal.present();
  }

  addSelectedIntakes(intakeObject: any) {
    if (!(this.intakeArray.value.find(intake => intake.value === intakeObject.value))) {
      this.intakeArray.push(this.formBuilder.group({
        value: [intakeObject.value, Validators.required],
      }));
    } else {
      this.intakeArray.removeAt(this.intakeArray.value.findIndex(intake => intake.value === intakeObject.value));
    }
  }

  removeIntake(i) {
    this.intakeArray.removeAt(i);
  }

  get intakeArray() {
    return this.intakeForm.get('intake') as FormArray;
  }

  submit() {
    if (this.intakeForm.valid) {
      const bodyObject = {
        exam_id: this.examId,
        docketsdue: this.intakeForm.get('docketIssuance').value ?
                    moment(this.intakeForm.get('docketIssuance').value).format('DD-MMM-YYYY').toUpperCase() : '',
        appraisalsdue: '',
        createdby: '',
        // types: this.intakeForm.get('type').value ? this.intakeForm.get('type').value : '',
        venue: `${this.intakeForm.get('location').value},${this.intakeForm.get('venue').value}`,
        intake_group: '',
        result_date: moment(this.intakeForm.get('examResultDate').value).format('DD-MMM-YYYY').toUpperCase()
      };

      if (this.onEdit) {
        const entryIdAndIntake = { entryid: this.intakeDetails.ENTRYID, intake: this.intakeForm.get('intake').value };
        this.presentLoading();
        const body = new HttpParams({ fromObject: { ...entryIdAndIntake, ...bodyObject } }).toString();
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        this.ws.post<any>('/exam/update_intake_entry', {
          url: this.devUrl,
          body,
          headers
        })
          .subscribe({
            next: () => {
              this.showToastMessage(
                'Intake updated successfully!',
                'success'
              );
            },
            error: (err) => {
              this.dismissLoading();
              this.showToastMessage(
                err.status + ': ' + err.error.error,
                'danger'
              );
            },
            complete: () => {
              this.dismissLoading().then(() => this.modalCtrl.dismiss('Wrapped Up!'));
            }
          });
      } else {
        const bodyArray = {'intakes[]' : []};
        const intakesMessage = this.intakeArray.value.join(', ');

        this.intakeArray.value.forEach(intake => {
          bodyArray['intakes[]'].push(intake);
        });

        this.alertCtrl.create({
          header: 'Adding new intakes',
          subHeader:
            'Are you sure you want to add new intakes with the following details:',
          message: `<p><strong>Intake: </strong> ${intakesMessage}</p>
                    <p><strong>Venue: </strong>${bodyObject.venue}</p>
                    <p><strong>Docket Issuance: </strong> ${bodyObject.docketsdue}</p>
                    <p><strong>Exam Result Date: </strong> ${bodyObject.result_date} </p>`,
          buttons: [
            {
              text: 'No',
              handler: () => { }
            },
            {
              text: 'Yes',
              handler: () => {
                this.presentLoading();
                const body = new HttpParams({ fromObject: { ...bodyArray, ...bodyObject } }).toString();
                const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                this.ws.post('/exam/create_intake_entry', { url: this.devUrl, body, headers }).subscribe({
                  next: () => {
                    this.showToastMessage(
                      'Intakes added successfully!',
                      'success'
                    );
                  },
                  error: (err) => {
                    this.dismissLoading();
                    this.showToastMessage(
                      err.status + ': ' + err.error.error,
                      'danger'
                    );
                  },
                  complete: () => {
                    this.dismissLoading().then(() => this.modalCtrl.dismiss('Wrapped Up!'));
                  }
                });
              }
            }
          ]
        }).then(alert => alert.present());
      }
    }
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl
      .create({
        message,
        duration: 5000,
        position: 'top',
        color,
        showCloseButton: true,
        animated: true
      })
      .then(toast => toast.present());
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss(null);
  }
}

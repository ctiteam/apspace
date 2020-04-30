import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CalendarComponentOptions } from 'ion2-calendar';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ExamScheduleAdmin } from 'src/app/interfaces/exam-schedule-admin';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-add-exam-schedule',
  templateUrl: './add-exam-schedule.page.html',
  styleUrls: ['./add-exam-schedule.page.scss'],
})

export class AddExamSchedulePage implements OnInit {
  @Input() onEdit: boolean;
  @Input() examScheduleDetails: ExamScheduleAdmin;

  loading: HTMLIonLoadingElement;

  devUrl = 'https://jeioi258m1.execute-api.ap-southeast-1.amazonaws.com/dev';
  modules$: Observable<any>;
  assessmentTypes$: Observable<any>;

  type = 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  searchTerm = '';
  modulesToBeSearched = [];

  examScheduleForm: FormGroup;
  selectedModule;

  staffCode;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private ws: WsApiService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.get('/staff/profile').then(
      staffProfile => {
        this.staffCode = staffProfile[0].CODE;
      }
    );

    this.modules$ = this.ws.get<any>('/exam/module_list', { url: this.devUrl });
    this.assessmentTypes$ = this.ws.get<any>('/exam/assessment_type', { url: this.devUrl });

    this.initializeForm(this.examScheduleDetails);

    this.examScheduleForm.valueChanges.subscribe(value => console.log(value));
  }

  initializeForm(examScheduleDetails: ExamScheduleAdmin = {
    ASSESSMENT_TYPE: '',
    CHECK_WEEK: 0,
    CREATEDBY: '',
    DATEDAY: '',
    EXAMID: 0,
    FROMDATE: '',
    MODULE: '',
    REMARKS: '',
    RESULT_DATE: '',
    STATUS: '',
    TILLDATE: '',
    TIME: '',
    TIMESTAMP: '',
    VENUE: ''
  }) {
    let splitTime;
    let startTime = '';
    let endTime = '';

    if (this.onEdit && examScheduleDetails.TIME) {
      splitTime = examScheduleDetails.TIME.split(' ');
      startTime = `${splitTime[0]} ${splitTime[1]}`;
      endTime = `${splitTime[3]} ${splitTime[4]}`;
    }

    this.examScheduleForm = this.formBuilder.group({
      publicationDate: [{from: examScheduleDetails.FROMDATE, to: examScheduleDetails.TILLDATE}, Validators.required],
      module: [examScheduleDetails.MODULE, Validators.required],
      date: [examScheduleDetails.DATEDAY, Validators.required],
      startTime: [moment(startTime, ['h:mm A']).format('HH:mm:00'), Validators.required],
      endTime: [moment(endTime, ['h:mm A']).format('HH:mm:00'), Validators.required],
      assessmentType: [examScheduleDetails.ASSESSMENT_TYPE, Validators.required],
      remarks: [examScheduleDetails.REMARKS]
    });
  }


  // initializeModule() {
  //   if (!(this.onEdit)) {
  //     return this.formBuilder.array([], [Validators.required]);
  //   } else {
  //     this.selectedModule = '4Lorem Ipsum';
  //     return [this.selectedModule, Validators.required];
  //   }
  // }

  // get moduleArray() {
  //   return this.examScheduleForm.get('module') as FormArray;
  // }

  // addSelectedModules(moduleObject: any) {
  //   if (!(this.moduleArray.value.find(module => module.value === moduleObject.value))) {
  //     this.moduleArray.push(this.formBuilder.group({
  //       value: [moduleObject.value, Validators.required],
  //     }));
  //   } else {
  //     this.moduleArray.removeAt(this.moduleArray.value.findIndex(module => module.value === moduleObject.value));
  //   }
  // }

  submit() {
    if (this.examScheduleForm.valid) {
      const body = new FormData();

      body.append('from_date', this.examScheduleForm.get('publicationDate').value.from);
      body.append('till_date', this.examScheduleForm.get('publicationDate').value.to);
      body.append('module', this.examScheduleForm.get('module').value);
      body.append('venue', '');
      body.append('dateday', moment(this.examScheduleForm.get('date').value).format('DD-MMM-YYYY').toUpperCase());
      body.append('time', `${moment(this.examScheduleForm.get('startTime').value).format('h:mm A')} till ${moment(this.examScheduleForm.get('endTime').value).format('h:mm A')}`);
      body.append('remarks', this.examScheduleForm.get('remarks').value);
      body.append('status', 'Inactive');
      body.append('created_by', this.staffCode);
      body.append('result_date', '23-APR-2020');
      body.append('check_week', '0');
      body.append('assessment_type', this.examScheduleForm.get('assessmentType').value);

      if (this.onEdit) {
        this.presentLoading();
        this.ws.post<any>('/exam/update_exam_schedule', {
          url: this.devUrl,
          body,
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
        })
        .subscribe({
          next: () => {
            this.showToastMessage(
              'Exam Schedule added successfully!',
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
        this.alertCtrl.create({
          header: 'Adding new exam schedule',
          subHeader:
            'Are you sure you want to add new exam schedule with the following details:',
          message: `<p><strong>Publication Date: </strong> ${body.get('from_date')} - ${body.get('till_date')}</p>
                    <p><strong>Module: </strong>${body.get('module')}</p>
                    <p><strong>Date: </strong>${body.get('dateday')}</p>
                    <p><strong>Time: </strong> ${body.get('time')}</p>
                    <p><strong>Assessment Type: </strong> ${body.get('assessment_type')} </p>
                    <p><strong>Remarks: </strong> ${body.get('remarks')} </p>`,
          buttons: [
            {
              text: 'No',
              handler: () => { }
            },
            {
              text: 'Yes',
              handler: () => {
                this.presentLoading();
                this.ws.post<any>('/exam/create_exam_schedule', {
                  url: this.devUrl,
                  body,
                  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
                })
                .subscribe({
                  next: () => {
                    this.showToastMessage(
                      'Exam Schedule added successfully!',
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

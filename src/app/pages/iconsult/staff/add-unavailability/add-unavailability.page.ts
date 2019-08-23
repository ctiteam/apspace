import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CalendarComponentOptions } from 'ion2-calendar';

import * as moment from 'moment';
import { WsApiService } from 'src/app/services';
import { Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';

@Component({
  selector: 'app-add-unavailability',
  templateUrl: './add-unavailability.page.html',
  styleUrls: ['./add-unavailability.page.scss'],
})
export class AddUnavailabilityPage implements OnInit {
  addUnavailabilityForm: FormGroup;
  submitted = false;
  loading: HTMLIonLoadingElement;

  todaysDate = new Date().toISOString();

  // Options for the ion-calendar (start date)
  startDateOptions: CalendarComponentOptions = {
    from: moment(this.todaysDate).add(1, 'day').toDate(),
    to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate(),
    disableWeeks: [0]
  };

  // Options for the ion-calendar (end date)
  endDateOptions: CalendarComponentOptions = {
    from: moment(this.todaysDate).add(2, 'day').toDate(),
    to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate()
  };

  weekDaysOptions = [
    { name: 'Monday', value: 'Mon' },
    { name: 'Tuesday', value: 'Tue' },
    { name: 'Wednesday', value: 'Wed' },
    { name: 'Thursday', value: 'Thu' },
    { name: 'Friday', value: 'Fri' },
    { name: 'Saturday', value: 'Sat' },
  ];


  constructor(
    private ws: WsApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.addUnavailabilityForm = this.formBuilder.group({
      startDate: [moment(this.todaysDate).add(1, 'day').format('YYYY-MM-DD'), Validators.required],
      repeatOn: [[], Validators.required],
      endDate: [moment(this.todaysDate).add(2, 'day').format('YYYY-MM-DD'), Validators.required],
      time: this.formBuilder.array([
        this.initTimeSlots(),
      ]),
    });
  }

  initTimeSlots(): FormGroup {
    return this.formBuilder.group({
      slotsTime: ['', Validators.required], // alwayes required
    });
  }

  addNewTimeSlot(): void {
    const control = this.formFields.time as FormArray;
    control.push(this.initTimeSlots());
  }

  removeTimeSlot(i: number): void {
    const control = this.formFields.time as FormArray;
    control.removeAt(i);
  }

  // convenience getter for easy access to form fields
  get formFields() {
    return this.addUnavailabilityForm.controls;
  }

  get timeFormData(): FormArray {
    return this.addUnavailabilityForm.get('time') as FormArray;
  }

  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addUnavailabilityForm.invalid) {
      return;
    }

    const body = {
      start_date: this.addUnavailabilityForm.value.startDate,
      end_date: this.addUnavailabilityForm.value.endDate,
      entry_datetime: '', // always empty from backend
      repeat: this.addUnavailabilityForm.value.repeatOn,
      start_time: this.addUnavailabilityForm.value.time.map(el => moment(el.slotsTime).format('kk:mm')),
      user_id: '' // alwayes empty from backend
    };

    this.alertCtrl.create({
      header: 'Adding new slot(s)',
      subHeader: 'Are you sure you want to mark all of the slots between the following two dates as unavailable:',
      message: `<p><strong>Start Date: </strong> ${this.addUnavailabilityForm.value.startDate}</p>
                <p><strong>End Date: </strong> ${this.addUnavailabilityForm.value.endDate || 'N/A'}</p>
                <p><strong>Slot Time: </strong> ${body.start_time.toString()}</p>
                <p><strong>Days: </strong> ${body.repeat.toString()}</p>`,
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            this.presentLoading();
            this.ws.post<any>('/iconsult/lecturer_add_unavailability', { body }).subscribe(
              {
                next: res => {
                  this.showToastMessage('Slot(s) has been marked as unavailable successfully!', 'success');
                },
                error: err => this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger'),
                complete: () => {
                  this.dismissLoading();
                  this.router.navigateByUrl('my-consultations').then(
                  );
                }
              }
            );
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'top',
      color,
      showCloseButton: true,
      animated: true,
      enterAnimation: toastMessageEnterAnimation,
      leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  mainDateChanged(event) {
    // Calculate the range of date the user can select when the start date is changed
    this.endDateOptions = {
      from: moment(event, 'YYYY-MM-DD').add(1, 'day').toDate(),
      to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate(),
    };
    // Set the end date to the first available day
    this.formFields.endDate.setValue(moment(event, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'));
  }

  // Checking for duplication in slots time and remove it when the user enters the data
  timeChanged(index: number) {
    const control = this.formFields.time as FormArray;
    this.formFields.time.value.map(
      el => moment(el.slotsTime).format('kk:mm')
    ).filter((v, i) => {
      if (this.formFields.time.value.map(
        el => moment(el.slotsTime).format('kk:mm')
      ).indexOf(v) !== i) {
        control.removeAt(index);
      }
      return this.formFields.time.value.map(
        el => moment(el.slotsTime).format('kk:mm')
      ).indexOf(v) === i;
    });
  }
}

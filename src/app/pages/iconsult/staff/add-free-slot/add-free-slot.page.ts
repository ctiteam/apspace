import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular';
import { Observable } from 'rxjs';

// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';
import { CalendarComponentOptions } from 'ion2-calendar';
import { Venue } from 'src/app/interfaces';
import { SettingsService, WsApiService } from 'src/app/services';

import * as moment from 'moment';

@Component({
  selector: 'app-add-free-slot',
  templateUrl: './add-free-slot.page.html',
  styleUrls: ['./add-free-slot.page.scss']
})
export class AddFreeSlotPage implements OnInit {
  venues$: Observable<Venue[]>;
  addFreeSlotForm: FormGroup;
  submitted = false;
  loading: HTMLIonLoadingElement;

  todaysDate = new Date().toISOString();

  // Options for the ion-calendar (start date)
  mainDateOptions: CalendarComponentOptions = {
    from: moment(this.todaysDate)
      .add(1, 'day')
      .toDate(),
    to: moment(this.todaysDate)
      .add(1, 'day')
      .add(12, 'month')
      .toDate(),
    disableWeeks: [0]
  };

  // Options for the ion-calendar (end date)
  repeatUntilDateOptions: CalendarComponentOptions = {
    from: moment(this.todaysDate)
      .add(2, 'day')
      .toDate(),
    to: moment(this.todaysDate)
      .add(1, 'day')
      .add(12, 'month')
      .toDate()
  };

  consultationTypeOptions = [
    { name: 'Single Slot', value: 'repeatnone' },
    { name: 'Weekly Repeated Slots', value: 'repeatweekly' },
    { name: 'Date Range', value: 'repeatnddate' }
  ];

  weekDaysOptions = [
    { name: 'Monday', value: 'Mon' },
    { name: 'Tuesday', value: 'Tue' },
    { name: 'Wednesday', value: 'Wed' },
    { name: 'Thursday', value: 'Thu' },
    { name: 'Friday', value: 'Fri' },
    { name: 'Saturday', value: 'Sat' }
  ];

  locationOptions = ['New Campus', 'TPM'];

  constructor(
    private ws: WsApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private settings: SettingsService
  ) { }

  ngOnInit() {
    if (this.settings.get('defaultCampus')) {
      this.venues$ = this.ws.get<Venue[]>(
        `/iconsult/locations?venue=${this.settings.get('defaultCampus')}`,
        {
          url: 'https://x8w3m20p69.execute-api.ap-southeast-1.amazonaws.com/dev'
        }
      );
    }
    this.addFreeSlotForm = this.formBuilder.group({
      slotType: [this.consultationTypeOptions[0].value, Validators.required], // alwayes required
      startDate: [
        moment(this.todaysDate)
          .add(1, 'day')
          .format('YYYY-MM-DD'),
        Validators.required
      ], // always required
      repeatOn: [[]],
      noOfWeeks: [0],
      endDate: [''],
      location: [this.settings.get('defaultCampus') || '', Validators.required], // always required
      venue: [this.settings.get('defaultVenue') || '', Validators.required], // alwayes required
      time: this.formBuilder.array([this.initTimeSlots()])
    });

    this.addFreeSlotForm.valueChanges.subscribe(value => console.log(value));
  }

  initTimeSlots(): FormGroup {
    return this.formBuilder.group({
      slotsTime: ['', Validators.required] // alwayes required
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
    return this.addFreeSlotForm.controls;
  }

  get timeFormData(): FormArray {
    return this.addFreeSlotForm.get('time') as FormArray;
  }

  showDefaultLocationWarningAlert(newCampus: string, newVenue: string) {
    this.alertCtrl
      .create({
        header: 'Updating Your Default Location?',
        subHeader:
          // tslint:disable-next-line: max-line-length
          'We noticed that you have entered a new location for your consultation hour. Do you want to use the new location as your default iConsult location?',
        buttons: [
          {
            text: 'No',
            handler: () => { }
          },
          {
            text: 'Yes',
            handler: () => {
              this.settings.set('defaultCampus', newCampus);
              this.settings.set('defaultVenue', newVenue);
            }
          }
        ]
      })
      .then(confirm => confirm.present());
  }

  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addFreeSlotForm.invalid) {
      return;
    }

    // Get slot algorithmn starts here
    const body = [];
    let startDate = this.addFreeSlotForm.value.startDate;

    if (this.addFreeSlotForm.value.slotType === this.consultationTypeOptions[0].value) {
      this.addFreeSlotForm.value.time.forEach(time => {
        const timeSlot = {
          location_id: this.addFreeSlotForm.value.venue,
          datetime: startDate + ' ' + moment(time.slotsTime).format('kk:mm:00')
        };

        body.push(timeSlot);
      });
    } else {
      let endDate = this.addFreeSlotForm.value.endDate;

      if (this.addFreeSlotForm.value.noOfWeeks > 0) {
        endDate = moment(this.addFreeSlotForm.value.startDate, 'YYYY-MM-DD')
          .add((+this.addFreeSlotForm.value.noOfWeeks * 7), 'days')
          .format('YYYY-MM-DD');
      }

      while (startDate < endDate) {
        const dayName = moment(startDate).format('ddd');
        if (this.addFreeSlotForm.value.repeatOn.includes(dayName)) {
          this.addFreeSlotForm.value.time.forEach(time => {
            const timeSlot = {
              location_id: this.addFreeSlotForm.value.venue,
              datetime: startDate + ' ' + moment(time.slotsTime).format('kk:mm:00')
            };

            body.push(timeSlot);
          });
        }

        const nextDate = moment(startDate).add(1, 'd').format('YYYY-MM-DD');
        startDate = nextDate;
      }
    }

    console.log(body); // TO BE REMOVED
    // Get slot algorithmn ends here

    // Temp solution until the backend change the methods
    // Only adding the needed data from the form
    // if (this.addFreeSlotForm.value.slotType === this.consultationTypeOptions[0].value) {
    //   // Single Slot
    //   body.date = this.addFreeSlotForm.value.startDate;
    // } else if (this.addFreeSlotForm.value.slotType === this.consultationTypeOptions[1].value) {
    //   // Repeat weekly
    //   body.start_date = this.addFreeSlotForm.value.startDate;
    //   body.end_date = moment(this.addFreeSlotForm.value.startDate, 'YYYY-MM-DD')
    //     .add((+this.addFreeSlotForm.value.noOfWeeks * 7) - 1, 'days')
    //     .format('YYYY-MM-DD');
    //   body.repeat = this.addFreeSlotForm.value.repeatOn;
    // } else if (this.addFreeSlotForm.value.slotType === this.consultationTypeOptions[2].value) {
    //   // Repeat Until a specific Date
    //   body.start_date = this.addFreeSlotForm.value.startDate;
    //   body.end_date = this.addFreeSlotForm.value.endDate;
    //   body.repeat = this.addFreeSlotForm.value.repeatOn;
    // }
    this.alertCtrl
      .create({
        header: 'Adding new slot(s)',
        subHeader:
          'Are you sure you want to add new slot(s) with the following details:',
        message: `<p><strong>Slot Date: </strong> ${this.addFreeSlotForm.value.startDate}</p>
                  <p><strong>Slot End Date: </strong> ${this.addFreeSlotForm.value.endDate || 'N/A'}</p>
                  <p><strong>Slot Time: </strong> ${this.addFreeSlotForm.value.time.map(time => moment(time.slotsTime).format('kk:mm'))}</p>
                  <p><strong>Slot Location: </strong> ${this.addFreeSlotForm.value.location}</p>
                  <p><strong>Slot Venue: </strong> ${this.addFreeSlotForm.value.venue} </p>`,
        buttons: [
          {
            text: 'No',
            handler: () => { }
          },
          {
            text: 'Yes',
            handler: () => {
              this.presentLoading();
              this.ws
                .post<any>('/iconsult/slot?', {
                  body,
                  url:
                    'https://x8w3m20p69.execute-api.ap-southeast-1.amazonaws.com/dev'
                })
                .subscribe({
                  next: () => {
                    this.showToastMessage(
                      'Slot(s) added successfully!',
                      'success'
                    );
                  },
                  error: () => {
                    this.dismissLoading();
                    this.showToastMessage(
                      'Something went wrong! please try again or contact us via the feedback page',
                      'danger'
                    );
                  },
                  complete: () => {
                    if (
                      this.addFreeSlotForm.value.venue !==
                      this.settings.get('defaultVenue')
                    ) {
                      this.showDefaultLocationWarningAlert(
                        this.addFreeSlotForm.value.location,
                        this.addFreeSlotForm.value.venue
                      );
                    }
                    this.dismissLoading();
                    const navigationExtras: NavigationExtras = {
                      state: { reload: true }
                    };
                    this.router.navigateByUrl(
                      'iconsult/my-consultations',
                      navigationExtras
                    );
                  }
                });
            }
          }
        ]
      })
      .then(confirm => confirm.present());
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
        // enterAnimation: toastMessageEnterAnimation,
        // leaveAnimation: toastMessageLeaveAnimation
      })
      .then(toast => toast.present());
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
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

  typeChanged(event) {
    if (event.detail.value === this.consultationTypeOptions[0].value) {
      this.formFields.endDate.setValue('');
      this.formFields.repeatOn.setValue([]);
      this.formFields.noOfWeeks.setValue([]);
      // Remove validation from all additional when type is single
      this.formFields.repeatOn.setValidators(null);
      this.formFields.repeatOn.updateValueAndValidity();

      this.formFields.endDate.setValidators(null);
      this.formFields.endDate.updateValueAndValidity();

      this.formFields.noOfWeeks.setValidators(null);
      this.formFields.noOfWeeks.updateValueAndValidity();
    }
    if (event.detail.value === this.consultationTypeOptions[1].value) {
      this.formFields.endDate.setValue('');

      // add validation when type is single slot
      this.formFields.repeatOn.setValidators(Validators.required);
      this.formFields.repeatOn.updateValueAndValidity();
      // add validation when type is single slot
      this.formFields.noOfWeeks.setValidators(Validators.required);
      this.formFields.noOfWeeks.updateValueAndValidity();

      // remove validation from end date when type is weekly repeatd
      this.formFields.endDate.setValidators(null);
      this.formFields.endDate.updateValueAndValidity();
    }
    if (event.detail.value === this.consultationTypeOptions[2].value) {
      this.formFields.noOfWeeks.setValue([]);
      // add validation when type is single slot
      this.formFields.repeatOn.setValidators(Validators.required);
      this.formFields.repeatOn.updateValueAndValidity();
      // add validation when type is single slot
      this.formFields.endDate.setValidators(Validators.required);
      this.formFields.endDate.updateValueAndValidity();

      // remove validation from number of weeks when type is date range
      this.formFields.noOfWeeks.setValidators(null);
      this.formFields.noOfWeeks.updateValueAndValidity();
    }
  }

  locationChanged(event) {
    // When the user changes the location, get the list of venues again
    this.formFields.venue.setValue('');
    // this.venueFieldDisabled = true;
    this.venues$ = this.ws.get<Venue[]>(
      `/iconsult/locations?venue=${event.detail.value}`,
      {
        url: 'https://x8w3m20p69.execute-api.ap-southeast-1.amazonaws.com/dev'
      }
    );
  }

  mainDateChanged(event) {
    // Calculate the range of date the user can select when the start date is changed
    // applicable only when the slot type is range
    if (
      this.formFields.slotType.value === this.consultationTypeOptions[2].value
    ) {
      this.repeatUntilDateOptions = {
        from: moment(event, 'YYYY-MM-DD')
          .add(1, 'day')
          .toDate(),
        to: moment(this.todaysDate)
          .add(1, 'day')
          .add(12, 'month')
          .toDate()
      };
      // Set the end date to the first available day
      this.formFields.endDate.setValue(
        moment(event, 'YYYY-MM-DD')
          .add(1, 'day')
          .format('YYYY-MM-DD')
      );
    }
  }

  // Checking for duplication in slots time and remove it when the user enters the data
  timeChanged(index: number) {
    const control = this.formFields.time as FormArray;
    this.formFields.time.value
      .map(el => moment(el.slotsTime).format('kk:mm'))
      .filter((v, i) => {
        if (
          this.formFields.time.value
            .map(el => moment(el.slotsTime).format('kk:mm'))
            .indexOf(v) !== i
        ) {
          control.removeAt(index);
        }
        return (
          this.formFields.time.value
            .map(el => moment(el.slotsTime).format('kk:mm'))
            .indexOf(v) === i
        );
      });
  }
}

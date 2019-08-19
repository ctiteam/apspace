import { Component, OnInit } from '@angular/core';
import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
  CalendarComponentOptions
} from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { WsApiService } from 'src/app/services';
import { Venue } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-free-slot',
  templateUrl: './add-free-slot.page.html',
  styleUrls: ['./add-free-slot.page.scss'],
})
export class AddFreeSlotPage implements OnInit {
  venues$: Observable<Venue[]>;
  addFreeSlotForm: FormGroup;
  submitted = false;

  todaysDate = new Date().toISOString();

  // Options for the ion-calendar (start date)
  mainDateOptions: CalendarComponentOptions = {
    from: moment(this.todaysDate).add(1, 'day').toDate(),
    to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate(),
    disableWeeks: [0]
  };

  // Options for the ion-calendar (end date)
  repeatUntilDateOptions: CalendarComponentOptions = {
    from: moment(this.todaysDate).add(2, 'day').toDate(),
    to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate()
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
    { name: 'Saturday', value: 'Sat' },
  ];

  locationOptions = [
    'New Campus',
    'TPM',
  ];

  constructor(
    private ws: WsApiService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.addFreeSlotForm = this.formBuilder.group({
      slotType: [this.consultationTypeOptions[0].value, Validators.required], // alwayes required
      startDate: [moment(this.todaysDate).add(1, 'day').format('YYYY-MM-DD'), Validators.required], // always required
      repeatOn: [[]],
      noOfWeeks: [null],
      endDate: [''],
      location: ['', Validators.required], // always required
      venue: ['', Validators.required], // alwayes required
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
    return this.addFreeSlotForm.controls;
  }

  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addFreeSlotForm.invalid) {
      return;
    }
    const body = {
      date: '',
      end_date: '',
      entry_datetime: '', // always empty from backend
      location_id: this.addFreeSlotForm.value.venue.id,
      repeat: [],
      rule_status: '', // always empty from backend
      start_date: '',
      start_time: this.addFreeSlotForm.value.time.map(el => moment(el.slotsTime).format('kk:mm')),
      user_id: '' // alwayes empty from backend
    };

    // Temp solution until the backend change the methods
    // Only adding the needed data from the form
    if (this.addFreeSlotForm.value.slotType === this.consultationTypeOptions[0].value) {
      // Single Slot
      body.date = this.addFreeSlotForm.value.startDate;
    } else if (this.addFreeSlotForm.value.slotType === this.consultationTypeOptions[1].value) {
      // Repeat weekly
      body.start_date = this.addFreeSlotForm.value.startDate;
      body.end_date = moment(this.addFreeSlotForm.value.startDate, 'YYYY-MM-DD')
        .add((+this.addFreeSlotForm.value.noOfWeeks * 7) - 1, 'days')
        .format('YYYY-MM-DD');
      body.repeat = this.addFreeSlotForm.value.repeatOn;
    } else if (this.addFreeSlotForm.value.slotType === this.consultationTypeOptions[2].value) {
      // Repeat Until a specific Date
      body.start_date = this.addFreeSlotForm.value.startDate;
      body.end_date = this.addFreeSlotForm.value.endDate;
      body.repeat = this.addFreeSlotForm.value.repeatOn;
    }
    console.log(body);
    this.ws.post<any>('/iconsult/lecaddfreeslots', { body }).subscribe(
      {
        next: res => console.log(res),
        error: err => console.log(err)
      }
    );
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
    this.venues$ = this.ws.get<Venue[]>(`/iconsult/getvenues/${event.detail.value}`, true);
  }

  mainDateChanged(event) {
    // Calculate the range of date the user can select when the start date is changed
    // applicable only when the slot type is range
    if (this.formFields.slotType.value === this.consultationTypeOptions[2].value) {
      this.repeatUntilDateOptions = {
        from: moment(event, 'YYYY-MM-DD').add(1, 'day').toDate(),
        to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate(),
      };
      // Set the end date to the first available day
      this.formFields.endDate.setValue(moment(event, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'));
    }
  }

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

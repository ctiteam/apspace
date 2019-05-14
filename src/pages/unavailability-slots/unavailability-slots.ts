import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, App, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import moment from 'moment';
import { SlotsProvider } from '../../providers';
import { UpcominglecPage } from '../iConsult-lecturer/upcominglec';
import { TabsPage } from '../tabs/tabs';
import { CalendarComponentOptions } from 'ion2-calendar';

@IonicPage()
@Component({
  selector: 'page-unavailability-slots',
  templateUrl: 'unavailability-slots.html',
})
export class UnavailabilitySlotsPage {
  todaysDate = new Date().toISOString();
  startDate = moment(this.todaysDate).add(1, 'day').format('YYYY-MM-DD');
  selectedStartDate: Date;
  startDateOptions: CalendarComponentOptions = {
    from: moment(this.todaysDate).add(1, 'day').toDate(),
    to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate()
  };
  endDateOptions: CalendarComponentOptions = {
    from: moment(this.startDate).add(1, 'day').toDate(),
    to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate()
  };

  form: FormGroup;
  items: Array<{ text: string }> = [];

  unfreeslots = {
    start_time: [

    ],
    user_id: '',
    repeat: [

    ],
    start_date: '',
    end_date: '',
    entry_datetime: '',
  };

  minDate: string;
  maxDate: string;
  endDate: string;
  time: string[] = [];
  minEndDate: string;
  MinDate: string;
  loading = this.loadingCtrl.create({
  });

  constructor(public http: HttpClient,
    public slotsProvider: SlotsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private _FB: FormBuilder,
    public app: App,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) {

    this.items.push({ text: 'Mon' });
    this.items.push({ text: 'Tue' });
    this.items.push({ text: 'Wed' });
    this.items.push({ text: 'Thur' });
    this.items.push({ text: 'Fri' });
    this.items.push({ text: 'Sat' });

    this.form = this._FB.group({
      slotsTime: ['', Validators.required],
      slots: this._FB.array([
        this.initslots(),
      ]),
    });

    this.minDate = new Date().toISOString();
    this.MinDate = moment(this.minDate).add(1, 'day').toISOString();
    this.maxDate = moment(this.MinDate).add(12, 'month').toISOString();
  }

  initslots(): FormGroup {
    return this._FB.group({
      slotsTime: ['', Validators.required],
    });
  }

  addNewInputField(): void {
    const control = this.form.controls.slots as FormArray;
    control.push(this.initslots());
  }

  removeInputField(i: number): void {
    const control = this.form.controls.slots as FormArray;
    let itemToRemove = this.time[i];
    this.time = this.time.filter((item) => {
      return item !== itemToRemove
    });
    control.removeAt(i);
    this.unfreeslots.start_time = this.time;
  }

  onSelectTime(index: number) {
    const control = this.form.controls.slots as FormArray;
    this.time = this.time.filter((v, i) => {
      if (this.time.indexOf(v) !== i) {
        control.removeAt(index);
      }
      return this.time.indexOf(v) === i;
    });
    this.unfreeslots.start_time = this.time;
  }

  onchangedate() {
    let dateInMilliSeconds = Date.parse(this.startDate);
    this.selectedStartDate = new Date(dateInMilliSeconds);
    this.endDateOptions = {
      from: moment(this.selectedStartDate).add(1, 'day').toDate(),
      to: moment(this.todaysDate).add(1, 'day').add(12, 'month').toDate(),
      color: 'danger'
    }
    this.endDate = '';
  }

  // lec confirmation
  async confirmation() {
    const alert = await this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to add this unavailability slots?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.loading.present();
            this.slotsProvider.addUnfreeslots(this.unfreeslots).subscribe(
              () => {
                this.loading.dismiss();
                this.app.getRootNav().setRoot(TabsPage);
                this.app.getRootNav().push(UpcominglecPage);
                this.presentToast();
              },
            );
          },
        },
      ],
    });
    await alert.present();
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Unavailability slots was added successfully',
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

}

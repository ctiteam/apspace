import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, App, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { SlotsProvider } from '../../providers';
import { UpcominglecPage } from '../iConsult-lecturer/upcominglec';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-addfreeslots',
  templateUrl: 'addfreeslots.html',
})
export class AddfreeslotsPage {

  rooms$: Observable<any>;
  form: FormGroup;
  hidden: boolean[] = [];
  locations: Array<{ id: string, title: string }>;
  items: Array<{ text: string }> = [];
  rulestatus = true;
  term = '';

  testsupdate = {
    cancel_reason: '',
  };

  freeslots = {
    start_time: [

    ],
    user_id: '',
    repeat: [

    ],
    date: '',
    location_id: '',
    rule_status: '',
    start_date: '',
    end_date: '',
    entry_datetime: ''
  };

  loading = this.loadingCtrl.create({
  });

  minDate: string;
  maxDate: string;
  repeatday: any;
  startDate: string;
  endDate: string;
  time: string[] = [];
  minEndDate: string;
  room: string;
  MinDate: string;
  sundaySelected = false;
  showTimeConflictMessage = false;
  formattedSelectedDate: any;
  repeatstartDate: string;
  repeatselected: any;
  no_of_weeks: number;
  alldate: string;
  alldates: string;
  enddatebefore: string;
  enddateafter: string;
  i: string;
  repeatweekbefore: number;
  repeatweekafter: number;

  constructor(
    public http: HttpClient,
    public slotsProvider: SlotsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _FB: FormBuilder,
    public app: App,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) {

    this.locations = [
      { title: 'New Campus', id: '1' },
      { title: 'TPM', id: '2' },
    ];

    this.items.push({ text: 'Mon' });
    this.items.push({ text: 'Tue' });
    this.items.push({ text: 'Wed' });
    this.items.push({ text: 'Thu' });
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
    this.repeatselected = "repeatnone";
    this.alldate = moment(this.MinDate).format('YYYY-MM-DD');
    this.no_of_weeks = 1;
  }

  selectRepeatType(value) {
    if (value == 'repeatnone') {
      this.repeatday = '';
      this.freeslots.repeat = [];
      this.freeslots.end_date = '';
      this.no_of_weeks = 1;
      this.freeslots.end_date = '';
    }
    else if (value == 'repeatweekly') {
      this.repeatday = ['Mon'];
      this.freeslots.repeat = this.repeatday;
      this.repeatweek();
    }
    else if (value == 'repeatenddate') {
      this.repeatday = ['Mon'];
      this.freeslots.repeat = this.repeatday;
      this.no_of_weeks = 1;
      this.minEndDate = moment(this.alldate).add(1, 'day').toISOString();
      this.enddateafter = moment(this.minEndDate).format('YYYY-MM-DD');
      this.endDate = this.enddateafter;
      this.freeslots.end_date = this.endDate;
    }
  }

  repeatweek() {
    this.repeatweekbefore = this.no_of_weeks * 7;
    this.repeatweekafter = this.repeatweekbefore - 1;
    this.enddatebefore = moment(this.alldate + 'T00:00:00.000Z').add(this.repeatweekafter, 'days').toISOString();
    this.freeslots.end_date = moment(this.enddatebefore).format('YYYY-MM-DD');
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

  onSelectTime(index: number) {
    const control = this.form.controls.slots as FormArray;
    this.time = this.time.filter((v, i) => {
      if (this.time.indexOf(v) !== i) {
        control.removeAt(index);
      }
      return this.time.indexOf(v) === i;
    });
    this.freeslots.start_time = this.time;
  }

  removeInputField(i: number): void {
    const control = this.form.controls.slots as FormArray;
    let itemToRemove = this.time[i];
    this.time = this.time.filter((item) => {
      return item !== itemToRemove
    });
    control.removeAt(i);
    this.freeslots.start_time = this.time;
  }

  // change venue base on location
  onchange(cvalue) {
    this.rooms$ = this.slotsProvider.getrooms(cvalue);
  }

  // lec confirmation
  async confirmation() {
    const alert = await this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to add this availability?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            if (this.alldate != '' && this.repeatselected !== 'repeatweekly' && this.repeatselected !== 'repeatenddate') {
              this.freeslots.start_date = '';
              this.freeslots.date = this.alldate;
            } else if (this.alldate != '' && this.repeatselected !== 'repeatnone') {
              this.freeslots.date = '';
              this.freeslots.start_date = this.alldate;
            }
            this.loading.present();
            this.slotsProvider.addfreeslots(this.freeslots).subscribe(
              () => {
                this.loading.dismiss();
                this.app.getRootNav().setRoot(TabsPage);
                this.app.getRootNav().push(UpcominglecPage);
                this.presentToast();
              },
              // () => {
              //   this.loading.dismiss();
              //   this.duplicateSlotAlert();
              // }
            );
          },
        },
      ],
    });
    await alert.present();
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Consultation hour was added successfully',
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

  portChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {
  }

  onChangeOneFreeSlotDate() {
    this.sundaySelected = false;
    let dateInMilliSeconds = Date.parse(this.alldate);
    this.formattedSelectedDate = new Date(dateInMilliSeconds);
    if (this.formattedSelectedDate.getDay() == 0) {
      this.sundaySelected = true;
    }
    this.minEndDate = moment(this.alldate).add(1, 'day').toISOString();
    this.endDate = '';
    //when start date change then recalculate end date by number of weeks
    this.repeatweek();
  }

  async duplicateSlotAlert() {
    const alert = await this.alertCtrl.create({
      title: 'Message',
      message: 'This slot is already exists.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, App, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
  currentDateTime: string = moment().format();
  rulestatus = true;
  term = '';

  testsupdate = {
    cancel_reason: '',
  };

  freeslots = {
    start_time: [

    ],
    availability_rule_id: '',
    user_id: '',
    repeat: [

    ],
    date: '',
    location: '',
    venue: '',
    rule_status: this.rulestatus,
    start_date: '',
    end_date: '',
    entry_datetime: this.currentDateTime,
    revision_id: '',
  };

  minDate: string;
  maxDate: string;
  myDate: string;
  repeatday: string;
  startDate: string;
  endDate: string;
  time: string[] = [];
  minEndDate: string;
  room: string;
  MinDate: string;

  constructor(
    public http: HttpClient,
    public slotsProvider: SlotsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _FB: FormBuilder,
    public app: App,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
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
    this.maxDate = moment(this.MinDate).add(6, 'month').toISOString();
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
    this.time[i] = '';
    control.removeAt(i);
  }

  // check repeat is selected
  repeatisClicked(i: number): void {
    if (this.hidden[i]) {
      this.hidden[i] = false;
      this.myDate = '';
    } else {
      this.hidden[i] = true;
      this.repeatday = '';
      this.startDate = '';
      this.endDate = '';
    }
  }

  // change venue base on location
  onchange(cvalue) {
    this.rooms$ = this.slotsProvider.getrooms(cvalue);
  }

  onchangedate() {
    this.minEndDate = moment(this.startDate).add(1, 'day').toISOString();
    this.endDate = '';
  }

  // lec confirmation
  async confirmation() {
    const alert = await this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to add this consultation hour?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.slotsProvider.addfreeslots(this.freeslots).subscribe(
              () => {
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
    console.log(event.value);
  }

}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, App, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import moment from 'moment';
import { SlotsProvider } from '../../providers';
import { UpcominglecPage } from '../iConsult-lecturer/upcominglec';

@IonicPage()
@Component({
  selector: 'page-unavailability-slots',
  templateUrl: 'unavailability-slots.html',
})
export class UnavailabilitySlotsPage {

  form: FormGroup;
  items: Array<{ text: string }> = [];
  currentDateTime: string = moment().format();
  rulestatus: boolean = true;

  unfreeslots = {
    start_time: [

    ],
    unavailability_rule_id: '',
    user_id: '',
    repeat: [

    ],
    rule_status: this.rulestatus,
    start_date: '',
    end_date: '',
    delete_time: '',
    entry_datetime: this.currentDateTime,
  };

  minDate: string;
  maxDate: string;
  startDate: string;
  endDate: string;
  time: string[] = [];
  minEndDate: string;

  constructor(public http: HttpClient,
              public slotsProvider: SlotsProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private _FB: FormBuilder,
              public app: App,
              private toastCtrl: ToastController,
  ) {

    this.items.push({ text: 'Mon' });
    this.items.push({ text: 'Tue' });
    this.items.push({ text: 'Wed' });
    this.items.push({ text: 'Thur' });
    this.items.push({ text: 'Fri' });

    this.form = this._FB.group({
      slotsTime: ['', Validators.required],
      slots: this._FB.array([
        this.initslots(),
      ]),
    });

    this.minDate = new Date().toISOString();
    this.maxDate = moment(this.minDate).add(6, 'month').toISOString();
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
    control.removeAt(i);
    this.time[i] = '';
  }

  onchangedate() {
    this.minEndDate = moment(this.startDate).add(1, 'day').toISOString();
    this.endDate = '';
  }

  // lec confirmation
  async confirmation() {
    const alert = await this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to add this Unavailability slots?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.slotsProvider.addUnfreeslots(this.unfreeslots).subscribe(
              () => {
                this.navCtrl.setRoot(UpcominglecPage);
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

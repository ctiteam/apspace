import { Component } from '@angular/core';
import {
  AlertController, App, IonicPage, LoadingController, NavController, NavParams, Tabs, ToastController,
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { SettingsProvider, UpcomingConStuProvider, WsApiProvider } from '../../providers';
import { IconsultPage } from '../iConsult-student/iconsult';
import { TabsPage } from '../tabs/tabs';
import { UpcomingstdPage } from '../upcomingstd/upcomingstd';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { StaffProfile, StudentProfile, Role } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-consultation-form',
  templateUrl: 'consultation-form.html',
})
export class ConsultationFormPage {

  verifyslot$: Observable<any>;
  availId = this.navParams.get('id');
  date = this.navParams.get('date');
  time = this.navParams.get('time');
  datetime = this.navParams.get('datetime');
  endTime = this.navParams.get('endtime');
  lecid = this.navParams.get('lecid');
  casid = this.navParams.get('casid');

  verifydata = this.date + ' ' + this.time + '.00000';
  loading = this.loadingCtrl.create({
  });

  booking = {
    availability_id: this.availId,
    date: this.date,
    time: this.time,
    con_with: '',
    reason: '',
    phone: '',
    email: '',
    note: '',
    casusername: this.casid,
  };

  conWith: string;
  reason: string;
  telnumber: string;
  emialaddress: string;
  notes: string;

  validation_messages = {
    'bookwith': [
      { type: 'required', message: 'Consultation with is required.' },
    ],
    'bookreason': [
      { type: 'required', message: 'Appointment reason is required.' }
    ],
    'phonenumber': [
      { type: 'pattern', message: 'Phone number is invalid.' }
    ],
    'stuemialaddress': [
      { type: 'required', message: 'Email address is required.' },
      { type: 'pattern', message: 'Email address is invalid.' },
    ],
  }

  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private UpcomingConStu: UpcomingConStuProvider,
    public app: App,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private settings: SettingsProvider,
    private ws: WsApiProvider,
    private validations_form: FormBuilder,
  ) {

    this.form = this.validations_form.group({
      bookwith: new FormControl('', Validators.required),
      bookreason: new FormControl('', Validators.required),
      phonenumber: new FormControl('', Validators.pattern('^[0-9]*$')),
      stuemialaddress: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });


    const role = this.settings.get('role');

    if (role & Role.Student) {
      this.ws.get<StudentProfile>('/student/profile').subscribe(
        res => {
          this.emialaddress = res.STUDENT_EMAIL;
        }
      );
    } else {
      this.ws.get<StaffProfile>('/staff/profile').subscribe(
        res => {
          this.emialaddress =  res[0].EMAIL;
        },
      );
    }

    this.booking.phone = '';
    this.booking.note = '';
  }

  ionViewDidLoad() {
    this.verifyslot$ = this.UpcomingConStu.verifyduplicateslotsfun(this.verifydata);
  }

  // student confirmation
  async confirmation() {
    const alert = await this.alertCtrl.create({
      title: 'Confirm booking',
      message: 'Are you sure you want to book this consultation hour?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            if(!this.booking.phone){
              this.booking.phone = '';
            }
            this.loading.present();
            this.UpcomingConStu.addbooking(this.booking)
              .subscribe(
                () => {
                  this.loading.dismiss();
                  const innerAlert = this.alertCtrl.create({
                    message: 'This slot just booked by a student, please book another slot.',
                    buttons: [
                      {
                        text: 'OK',
                        handler: () => {
                          this.app.getRootNav().setRoot(TabsPage);
                          this.app.getRootNav().push(UpcomingstdPage);        
                        },
                      },
                    ],
                  });
                  innerAlert.present();
                },
                () => {
                  this.loading.dismiss();
                  this.app.getRootNav().setRoot(TabsPage);
                  this.app.getRootNav().push(UpcomingstdPage);
                  this.presentToast();
                }
              );
          },
        },
      ],
    });
    await alert.present();
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Consultation hour was booked successfully',
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

}

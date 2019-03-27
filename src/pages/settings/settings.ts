import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Content,
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ToastController,
  AlertController,
} from 'ionic-angular';
import {
  AppAnimationProvider,
  UserSettingsProvider,
  VersionProvider,
  WsApiProvider,
  SettingsProvider,
} from '../../providers';
import { Role, StudentProfile, StaffProfile } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild(Content) content: Content;
  activeTheme: string;
  activeColorScheme: string;
  appVersion: string;
  themeOptions = [
    { title: 'Light Theme (Default)', value: 'light-theme' },
    { title: 'Dark Theme', value: 'dark-theme' },
  ];

  colorSchemeOptions = [
    { title: 'Blue (Default)', value: 'blue-color-scheme' },
    { title: 'Green', value: 'green-color-scheme' },
    { title: 'Grey', value: 'grey-color-scheme' },
    { title: 'Orange', value: 'orange-color-scheme' },
    { title: 'Pink', value: 'pink-color-scheme' },
  ];

  toast(msg: string) {
    this.toastCtrl
      .create({
        message: msg,
        duration: 7000,
        position: "bottom",
        showCloseButton: true
      })
      .present();
  }

  byodData: {username: string, userEmail: string};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private elRef: ElementRef,
    private appAnimationProvider: AppAnimationProvider,
    private userSettings: UserSettingsProvider,
    public platform: Platform,
    private version: VersionProvider,
    private settings: SettingsProvider,
    private ws: WsApiProvider,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,

  ) {
    this.userSettings
      .getActiveTheme()
      .subscribe(value => (this.activeTheme = value));
    this.userSettings
      .getColorScheme()
      .subscribe(value => (this.activeColorScheme = value));
  }

  ionViewDidLoad() {
    this.appVersion = this.version.name;
    this.appAnimationProvider.addAnimationsToSections(this.elRef);
    // ON PAGE SCROLL
    this.content.ionScroll.subscribe((ev: any) => {
      this.appAnimationProvider.addAnimationsToSections(this.elRef);
    });
  }

  toggleTheme() {
    this.userSettings.setActiveTheme(this.activeTheme);
  }

  toggleColorScheme() {
    this.userSettings.setColorScheme(this.activeColorScheme);
  }

  resetByod() {
    const confirm = this.alertCtrl.create({
      title: 'BYOD Reset',
      message: 'You are about to send a request to the helpdesk support system to reset your BYOD. Do you want to continue?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.ws.get('/byod/reset').subscribe(
              data => {
                console.log(data);
              },
              err => {
                console.log(err);
              },
              () => {
                this.toast("Your request has been sent to the helpdesk support system and it is being processed now.")
              }
            );
          }
        }
      ]
    });
    confirm.present();
  }
}

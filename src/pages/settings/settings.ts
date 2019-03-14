import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Content,
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ToastController,
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
    private toastCtrl: ToastController

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

  toggleTheme($event, value: string) {
    this.userSettings.setActiveTheme(value);
  }

  toggleColorScheme($event, value: string) {
    this.userSettings.setColorScheme(value);
  }

  resetByod(){
    const role = this.settings.get('role');
    if (role & Role.Student) {
      this.ws.get<StudentProfile>('/student/profile').subscribe(
        res => {
          this.byodData = {username: res.STUDENT_NUMBER, userEmail: res.STUDENT_EMAIL}
        },
        _ => {},
        () => {          
          this.sendByodResetRequest(this.byodData);
        }
      );
    } else {
      this.ws.get<StaffProfile>('/staff/profile').subscribe(
        res => {
          this.byodData = {username: res[0].ID, userEmail: res[0].EMAIL}
        },
        _ => {},
        () => {
          this.sendByodResetRequest(this.byodData);
        }
      );
    }
  }

  sendByodResetRequest(byodData: {username: string, userEmail: string}){
    console.log('username is : ' + byodData.username);
    console.log('email is : ' + byodData.userEmail);
    this.toast("Your request has been sent to the helpdesk support system. You will be notified through email.")

  }

}

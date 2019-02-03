import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Content,
  Platform
} from "ionic-angular";
import {
  AppAnimationProvider,
  UserSettingsProvider
} from "../../providers";

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  @ViewChild(Content) content: Content;
  public activeTheme: string;
  public activeColorScheme: string;
  themeOptions = [
    { title: "Light Theme (Default)", value: "light-theme" },
    { title: "Dark Theme", value: "dark-theme" }
  ];

  colorSchemeOptions = [
    { title: "Blue (Default)", value: "blue-color-scheme" },
    { title: "Green", value: "green-color-scheme" },
    { title: "Grey", value: "grey-color-scheme" },
    { title: "Orange", value: "orange-color-scheme" },
    { title: "Pink", value: "pink-color-scheme" }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private elRef: ElementRef,
    private appAnimationProvider: AppAnimationProvider,
    private userSettings: UserSettingsProvider,
    public platform: Platform
  ) {
    this.userSettings
      .getActiveTheme()
      .subscribe(value => (this.activeTheme = value));
    this.userSettings
      .getColorScheme()
      .subscribe(value => (this.activeColorScheme = value));
  }

  ionViewDidLoad() {
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
}

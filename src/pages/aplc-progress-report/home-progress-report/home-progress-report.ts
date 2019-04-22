import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-home-progress-report",
  templateUrl: "home-progress-report.html",
})
export class HomeProgressReportPage {
  constructor(public navCtrl: NavController) { }
  ionViewDidLoad() { }

  openPage(page: string) {
    this.navCtrl.push(page);
  }
}

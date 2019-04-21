
import { Component } from "@angular/core";
import { IonicPage, MenuController } from "ionic-angular";


@IonicPage()
@Component({
  selector: "page-view-progress-report",
  templateUrl: "view-progress-report.html",
})
export class ViewProgressReportPage {
  subject: string;
  constructor(public menu: MenuController) { }

  ionViewDidLoad() {
  }

  // TOGGLE THE MENU
  toggleFilterMenu() {
    this.menu.toggle();
  }

  onSubjectChanged(){

  }

  onClassCodeChanged(){

  }
}

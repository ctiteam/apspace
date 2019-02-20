import { Component } from '@angular/core';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { ActionSheetController, Content, IonicPage, Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

import { ExamSchedule, StudentProfile, Role } from '../../interfaces';
import { SettingsProvider, TimetableProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-exam-schedule',
  templateUrl: 'exam-schedule.html',
})
export class ExamSchedulePage {

  exam$: Observable<ExamSchedule[]>;

  intake: string;
  intakes: string[];
  selectedIntake: string;
  showNoIntakeMessage = false;
  numOfSkeletons = new Array(5);

  constructor(
    public plt: Platform,
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    private ws: WsApiProvider,
    private settings: SettingsProvider,
    public tt: TimetableProvider,

  ) {}

  presentActionSheet() {
    if (this.plt.is('cordova') && !this.plt.is('ios')) {
      const options: ActionSheetOptions = {
        buttonLabels: this.intakes,
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= 1 + this.intakes.length) {
          this.intake = this.intakes[buttonIndex - 1] || '';
          if(this.intake !== ''){
            this.showNoIntakeMessage = false;
            this.settings.set('examIntake', this.intake);
            this.doRefresh();
          }
          else{
            this.showNoIntakeMessage = true;
          }
        }
      });
    } else {
      const intakesButton = this.intakes.map(intake => ({
        text: intake,
        handler: () => {
          this.intake = intake;
          this.settings.set('examIntake', this.intake);
          this.showNoIntakeMessage = false;
          this.doRefresh();
        },
      }));
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          ...intakesButton, { text: 'Cancel', role: 'cancel' },
        ],
      });
      actionSheet.present();
    }
  }

  /** Check and update intake on change. */
  changeIntake(intake: string) {
    if (intake !== this.intake) {
      this.showNoIntakeMessage = false;      
      this.settings.set('examIntake', this.intake = intake);      
      this.doRefresh();
    }
  }

  ionViewDidLoad() {
    const intake = this.settings.get('examIntake');
    if (intake !== undefined) { // intake might be ''
      this.intake = intake;
      this.doRefresh();
    } else {
      if(this.settings.get("role") & Role.Student){
        this.ws.get<StudentProfile>('/student/profile').subscribe(p => {
          this.intake = p.INTAKE;
        });
      } else{
        this.showNoIntakeMessage = true;
      }
      this.doRefresh();
    }
    this.tt.get().subscribe(tt => {
      this.intakes = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort();
    });
  }

  doRefresh(refresher?) {
    const url = `/examination/${this.intake}`;
    const opt = { auth: false };
    this.exam$ = this.ws.get<ExamSchedule[]>(url, refresher, opt).pipe(
      finalize(() => (refresher && refresher.complete())),
    );
  }
}

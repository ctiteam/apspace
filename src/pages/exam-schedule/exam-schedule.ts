import { Component } from '@angular/core';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { ActionSheetButton, ActionSheetController, IonicPage, Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';

import { ExamSchedule, StudentProfile, Timetable } from '../../interfaces';
import { LoadingControllerProvider, SettingsProvider, TimetableProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-exam-schedule',
  templateUrl: 'exam-schedule.html',
})
export class ExamSchedulePage {

  exam$: Observable<ExamSchedule[]>;

  intake: string = '';
  intakes: string[] = [];
  selectedIntake: string = '';

  constructor(
    public plt: Platform,
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    private ws: WsApiProvider,
    private loading: LoadingControllerProvider,
    private settings: SettingsProvider,
    public tt: TimetableProvider,
  ) { }

  presentActionSheet() {
    if (this.plt.is('cordova') && !this.plt.is('ios')) {
      const options: ActionSheetOptions = {
        buttonLabels: this.intakes,
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= 1 + this.intakes.length) {
          this.intake = this.intakes[buttonIndex - 1] || '';
          this.settings.set('examIntake', this.intake);
          this.doRefresh();
        }
      });
    } else {
      const intakesButton = this.intakes.map(intake => {
        return {
          text: intake,
          handler: () => {
            this.intake = intake;
            this.settings.set('examIntake', this.intake);
            this.doRefresh();
          },
        } as ActionSheetButton;
      });
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
      this.settings.set('examIntake', this.intake = intake);
      this.doRefresh();
    }
  }

  ionViewDidLoad() {
    this.loading.presentLoading();
    const intake = this.settings.get('examIntake');
    if (intake !== undefined) { // intake might be ''
      this.intake = intake;
      this.doRefresh();
    } else {
      this.ws.get<StudentProfile[]>('/student/profile')
        .subscribe(p => {
          this.intake = p[0].INTAKE_CODE;
          this.doRefresh();
        });
    }
    this.tt.get().subscribe(tt => {
      this.intakes = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort();
    });
  }

  doRefresh(refresher?) {
    this.exam$ = this.ws.get<ExamSchedule[]>(`/examination/${this.intake}`).pipe(
      finalize(() => (refresher && refresher.complete(), this.loading.dismissLoading())),
    );
  }

}

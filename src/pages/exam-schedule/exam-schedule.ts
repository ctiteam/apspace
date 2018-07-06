import { Component } from '@angular/core';
import { IonicPage, Platform, ActionSheetController, ActionSheetButton } from 'ionic-angular';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';

import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';

import { WsApiProvider, LoadingControllerProvider, SettingsProvider, TimetableProvider } from '../../providers';
import { ExamSchedule, StudentProfile, Timetable } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-exam-schedule',
  templateUrl: 'exam-schedule.html',
})
export class ExamSchedulePage {

  exam$: Observable<ExamSchedule[]>;
  intakes$: Observable<Timetable[]>;

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

  ionViewDidLoad() {
    this.loading.presentLoading();
    const intake = this.settings.get('examIntake');
    if (intake !== undefined) { // intake might be ''
      this.intake = intake;
      this.getExam(this.intake);
    } else {
      this.ws.get<StudentProfile[]>('/student/profile')
        .subscribe(p => {
          this.intake = p[0].INTAKE_CODE;
          this.getExam(this.intake);
        })
    }
    this.tt.get().subscribe(tt => {
      this.intakes = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort();
    })
  }

  doRefresh(refresher?){
    const url = `/examination/${this.intake}`;
    const options = { url: 'https://api.apiit.edu.my', auth: false };
    this.exam$ = this.ws.get<ExamSchedule[]>(url, true, options).pipe(
      finalize(() => refresher && refresher.complete())
    )
  }

  getExam(intake: string) {
    const url = `/examination/${intake}`;
    const options = { url: 'https://api.apiit.edu.my', auth: false };
    this.exam$ = this.ws.get<ExamSchedule[]>(url, true, options).pipe(
      finalize(() => this.loading.dismissLoading()),
    )
  }

  presentActionSheet() {
    if (this.plt.is('cordova')) {
      const options: ActionSheetOptions = {
        buttonLabels: ['Intakes', ...this.intakes],
        addCancelButtonWithLabel: 'Cancel'
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= 1 + this.intakes.length) {
          this.intake = this.intakes[buttonIndex - 2] || '';
          this.settings.set('examIntake', this.intake);
          this.getExam(this.intake);
        }
      });
    } else {
      let intakesButton = this.intakes.map(intake => <ActionSheetButton>{
        text: intake,
        handler: () => {
          this.intake = intake;
          this.settings.set('examIntake', this.intake);
          this.getExam(this.intake)
        }
      });
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          { text: 'Intakes', handler: () => { } },
          ...intakesButton, { text: 'Cancel', role: 'cancel' }
        ]
      });
      actionSheet.present();
    }
  }
}

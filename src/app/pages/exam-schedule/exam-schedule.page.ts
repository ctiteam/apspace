import { Component, OnInit } from '@angular/core';
import {  ActionSheetOptions } from '@ionic-native/action-sheet';
import { ActionSheetController,  Platform, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ExamSchedule, Role , StudentProfile } from '../../interfaces';
import { IntakeListingService, WsApiService, SettingsService } from '../../services';
import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';

@Component({
  selector: 'app-exam-schedule',
  templateUrl: './exam-schedule.page.html',
  styleUrls: ['./exam-schedule.page.scss'],
})
export class ExamSchedulePage implements OnInit {
  exam$: Observable<ExamSchedule[]>;

  intake: string;
  intakes: string[];
  selectedIntake: string;
  showNoIntakeMessage = false;
  skeletonSettings = {
    numberOfSkeltons: new Array(9),
  };
  constructor(
    public plt: Platform,
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private il: IntakeListingService,
    private ws: WsApiService,
    private settings: SettingsService,
  ) { }


  async presentActionSheet() {
    if (this.plt.is('cordova') && !this.plt.is('ios')) {
      const options: ActionSheetOptions = {
        buttonLabels: this.intakes,
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= 1 + this.intakes.length) {
          this.intake = this.intakes[buttonIndex - 1] || '';
          if (this.intake !== '') {
            this.showNoIntakeMessage = false;
            this.settings.set('examIntake', this.intake);
            this.doRefresh();
          } else {
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
      const actionSheet = await this.actionSheetCtrl.create({
        buttons: [
          ...intakesButton, { text: 'Cancel', role: 'cancel' },
        ],
      });
      await actionSheet.present();
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

  ngOnInit() {
    this.il.get().subscribe(ii => {
      this.intakes = ii.map(i => i.INTAKE_CODE);
    });
    const intake = this.settings.get('examIntake');
    if (intake !== undefined) { // intake might be ''
      this.intake = intake;
      this.doRefresh();
    } else {
      /* tslint:disable:no-bitwise */
      if (this.settings.get('role') & Role.Student) {

/* tslint:enable:no-bitwise */
        this.ws.get<StudentProfile>('/student/profile').subscribe(p => {
          this.intake = p.INTAKE;
        },
        (_) => {},
        () => this.doRefresh()
        );
      } else {
        this.showNoIntakeMessage = true;
      }
    }
  }

  doRefresh(refresher?) {
    const url = `/examination/${this.intake}`;
    const opt = { auth: false };
    this.exam$ = this.ws.get<ExamSchedule[]>(url, refresher, opt).pipe(
      finalize(() => (refresher && refresher.target.complete())),
    );
    this.il.get(Boolean(refresher)).subscribe(ii => {
      this.intakes = ii.map(i => i.INTAKE_CODE);
    });
  }


  async presentIntakeSearch() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      // TODO: store search history
      componentProps: { items: this.intakes, notFound: 'No Intake Selected' },
    });
    await modal.present();
    // default item to current intake if model dismissed without data
    const { data: { item: intake } = { item: this.intake } } = await modal.onDidDismiss();
    this.changeIntake(intake);
  }


}

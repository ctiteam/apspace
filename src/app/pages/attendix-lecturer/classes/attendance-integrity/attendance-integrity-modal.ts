import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { ResetAttendanceGQL, ScheduleInput } from 'src/generated/graphql';
@Component({
  selector: 'page-attendance-integrity-modal',
  templateUrl: 'attendance-integrity-modal.html',
  styleUrls: ['attendance-integrity-modal.scss']
})

export class AttendanceIntegrityModalPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private resetAttendance: ResetAttendanceGQL,
    private loadingCtrl: LoadingController
  ) {
  }
  /* input from classes page */
  possibleExtraClasses$: Observable<{
    classCode: string,
    date: string,
    timeFrom: string,
    timeTo: string,
    total: string,
    type: string,
    checked: boolean
  }[]>;
  possibleClasses: {
    classCode: string,
    date: string,
    timeFrom: string,
    timeTo: string,
    total: string,
    type: string,
    checked: boolean
  }[] = [];

  loading: HTMLIonLoadingElement;
  checkAll = false;

  recordsDeleted = [];
  recordsNotDeleted = [];

  ngOnInit() {
    this.possibleExtraClasses$ = of(this.possibleClasses);
  }

  async checkAllClasses() {
    this.checkAll
      ? (await this.possibleExtraClasses$.toPromise()).map(record => record.checked = true)
      : (await this.possibleExtraClasses$.toPromise()).map(record => record.checked = false);
  }

  dismiss(withRefresh: boolean) {
    this.modalCtrl.dismiss(this.recordsDeleted.length > 0 || withRefresh ? { refresh: true } : {});
  }

  /** Delete (reset) attendance, double confirm. */
  async reset() {
    const recordsToDelete = (await this.possibleExtraClasses$.toPromise()).filter(record => record.checked);
    this.alertCtrl.create({
      cssClass: 'delete-warning',
      header: 'Delete Attendance Record(s)!',
      message: `Are you sure that you want to <span class="danger-text text-bold">Permanently Delete</span> all ${recordsToDelete.length} attendance record(s)?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary-txt-color',
        },
        {
          text: 'Delete',
          cssClass: 'danger-text',
          handler: () => {
            if (recordsToDelete.length !== 0) {
              this.presentLoading();
            }
            // tslint:disable-next-line: prefer-const
            let results = recordsToDelete.reduce((promiseChain, record) => {
              return promiseChain.then(() => new Promise((resolve) => {
                this.deleteRecord(record, resolve);
              }));
            }, Promise.resolve());

            results.then(() => {
              if (recordsToDelete.length === this.recordsDeleted.length) {
                this.toastCtrl.create({
                  message: `${this.recordsDeleted.length} record(s) deleted successfully`,
                  duration: 3000,
                  position: 'top',
                  color: 'success',
                  showCloseButton: true,
                }).then(toast => toast.present());
              } else {
                this.toastCtrl.create({
                  message: `<h3>${this.recordsDeleted.length} record(s) deleted successfully and we could not delete ${this.recordsNotDeleted.length} record(s)</h3>
                            <p>Records not deleted are: ${this.recordsNotDeleted.toString()}</p>`,
                  duration: 15000,
                  position: 'top',
                  color: 'danger',
                  showCloseButton: true,
                }).then(toast => toast.present());
              }
              this.dismissLoading();
              // close the modal if no more extra items
              if (this.possibleClasses.length === 0) {
                this.dismiss(true);
              }
            });
          }
        }
      ]
    }).then(alert => alert.present());
  }

  deleteRecord(record, cb) {
    const schedule: ScheduleInput = {
      classcode: record.classCode,
      date: record.date,
      startTime: record.timeFrom,
      endTime: record.timeTo,
      classType: record.type
    };

    this.resetAttendance.mutate({ schedule }).subscribe(
      () => {
        this.recordsDeleted.push(record);
        this.possibleClasses = this.possibleClasses.filter(possibleRecord => !(record.classCode === possibleRecord.classCode
          && record.date === possibleRecord.date
          && record.timeFrom === possibleRecord.timeFrom
          && record.timeTo === possibleRecord.timeTo && record.type === possibleRecord.type)
        );
        this.possibleExtraClasses$ = of(this.possibleClasses);
      },
      e => {
        this.recordsNotDeleted.push(record.classCode + ' on ' + record.date + ' (' + e + ').');
        console.error(e);
        cb();
      },
      () => cb()
    );
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 20000,
      message: 'Deleting Records ...',
      translucent: true,
      animated: true
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      return await this.loading.dismiss();
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-filing-report',
  templateUrl: './filing-report.page.html',
  styleUrls: ['./filing-report.page.scss'],
})
export class FilingReportPage implements OnInit {
  readPolicyCheckbox = false;
  loading: HTMLIonLoadingElement;
  categories = [
    'Attire',
    'Behaviour',
  ];
  studentId = '';
  description = '';
  selectedCategory = this.categories[0];

  constructor(
    private loadingController: LoadingController,
    public platform: Platform,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() { }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 90000,
      message: 'Analyzing the picture...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 6000,
      position: 'top',
      color,
      showCloseButton: true,
      animated: true,
    }).then(toast => toast.present());
  }
}

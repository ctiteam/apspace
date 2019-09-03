import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ConsultationSlot, StaffDirectory, SlotDuplicated } from 'src/app/interfaces';
import { Storage } from '@ionic/storage';
import { WsApiService } from 'src/app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-book-slot-modal',
  templateUrl: 'book-slot-modal.html',
  styleUrls: ['book-slot-modal.scss']
})
export class BookSlotModalPage implements OnInit {
  verifyslot$: Observable<SlotDuplicated>;
  dataToSend: { slotData: ConsultationSlot, staffData: StaffDirectory }; // DATA COMING FROM THE PAGE
  studentEmail: string;
  loading: HTMLIonLoadingElement;

  formModel: {
    staffName: string;
    consultationWith: string;
    bookingDate: string,
    bookingTime: string,
    note: string;
    reason: string;
    studentEmail: string;
    studentContactNumber: string;
  };

  consultationWithOptions = [
    'Lecturer',
    'Masters Supervisor',
    'Doctoral Supervisor',
    'Internship Supervisor',
    'FYP Supervisor',
    'Academic Mentor',
    'Programme Leader',
    'Head of School',
    'Dean',
    'Registrar',
    'Manager Student Relations',
  ];


  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private ws: WsApiService,
    public alertCtrl: AlertController,
    private loadingController: LoadingController,
    private toastCtrl: ToastController
  ) {
  }
  ngOnInit() {
    const dataToVerify = this.dataToSend.slotData.datetimeforsorting + '.00000';
    this.verifyslot$ = this.ws.get<SlotDuplicated>(`/iconsult/verifyduplicateslot/${dataToVerify}`, true);
    this.formModel = {
      staffName: this.dataToSend.staffData.FULLNAME,
      consultationWith: '',
      bookingDate: this.dataToSend.slotData.datetime,
      bookingTime: this.dataToSend.slotData.time + ' - ' + this.dataToSend.slotData.endtime,
      note: '',
      reason: '',
      studentEmail: '',
      studentContactNumber: '',
    };
    this.storage.get('/student/profile').then(
      studentProfile => {
        this.studentEmail = studentProfile.STUDENT_EMAIL; // STORE THE EMAIL TO SEND IT WITH THE REQUEST
        this.formModel.studentEmail = studentProfile.STUDENT_EMAIL;
      }
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  bookSlot() {

    this.alertCtrl.create({
      header: 'Confirm Booking',
      subHeader: 'Are you sure you want to book the following consultation hour?',
      message: `Consultation hour with ${this.dataToSend.staffData.FULLNAME}
       on ${this.dataToSend.slotData.date} at ${this.dataToSend.slotData.time}`,
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            // START THE LOADING
            this.presentLoading();
            this.ws.post<any>('/iconsult/addbooking', {
              body: {
                availability_id: this.dataToSend.slotData.availibilityid,
                date: this.dataToSend.slotData.date,
                time: this.dataToSend.slotData.timee,
                casusername: this.dataToSend.staffData.ID,
                con_with: this.formModel.consultationWith,
                reason: this.formModel.reason,
                phone: this.formModel.studentContactNumber,
                note: this.formModel.note,
                email: this.studentEmail // TO PREVENT CHANGING THE EMAIL FROM THE UI
              },
            }).subscribe(

              {
                next: _ => {
                  this.showToastMessage('Slot has been booked successfully!', 'success');
                },
                error: _ => {
                  this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger');
                },
                complete: () => {
                  this.dismissLoading();
                  this.modalCtrl.dismiss('booked');
                }
              }
            );
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
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
      // enterAnimation: toastMessageEnterAnimation,
      // leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }
}

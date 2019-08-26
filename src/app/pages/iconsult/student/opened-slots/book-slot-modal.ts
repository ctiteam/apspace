import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
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
    public alertCtrl: AlertController
  ) {
  }
  ngOnInit() {
    const dataToVerify = this.dataToSend.slotData.datetimeforsorting + '.00000';
    this.verifyslot$ =  this.ws.get<SlotDuplicated>(`/iconsult/verifyduplicateslot/${dataToVerify}`, true);
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
                next: () => {
                  // SHOW USER SUCCESS MESSAGE
                },
                error: err => {
                  // SHOW USER ERROR MESSAGE
                  console.log(err);
                },
                complete: () => {
                  // HIDE THE LOADING
                  // TRIGGER NEW EVENT TO SHOW REFRESH THE LIST OF CONSULTATIONS
                  this.modalCtrl.dismiss();
                }
              }
            );
          }
        }
      ]
    }).then(confirm => confirm.present());
  }
}

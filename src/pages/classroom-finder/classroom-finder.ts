import { Component } from '@angular/core';
import {
  IonicPage, LoadingController, ModalController, NavController, NavParams,
  ToastController,
} from 'ionic-angular';
import { TimetableProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-classroom-finder',
  templateUrl: 'classroom-finder.html',
})
export class ClassroomFinderPage {
  now = new Date();
  selectedDay = this.now.getDay().toString();
  selectedTime: string;
  selectedDuration = 60;
  timetableData;
  listOfClassrooms = [];
  listOfFreeRooms = [];

  typeOfRooms = {
    auditorium: false,
    classroom: false,
    lab: false,
  };

  location = {
    newCampus: false,
    apiitTpm: false,
  };

  loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private timetableProv: TimetableProvider,
    public modalCtrl: ModalController,
  ) {
    let hour = this.now.getHours().toString();
    let minute = this.now.getMinutes().toString();
    if (hour.length === 1) {
      hour = '0' + hour;
    }
    if (minute.length === 1) {
      minute = '0' + minute;
    }
    this.selectedTime = hour + ':' + minute;
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Searching...',
    });
    return await this.loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  presentRoomTimetable(room: string) {
    this.navCtrl.push('ClassroomFinderModalPage', { room });
  }

  getFreeRoom() {
    // Get array of selected locations
    this.listOfClassrooms = [];
    this.listOfFreeRooms = [];
    let selectedTypeOfRooms = []; // Besides normal classrooms
    if (this.typeOfRooms.lab) {
      selectedTypeOfRooms = ['Lab', 'LAB', 'Studio', 'Suite'];
    }
    if (this.typeOfRooms.auditorium) {
      selectedTypeOfRooms.push('Auditorium');
    }
    const selectedLocations = [];
    if (this.location.newCampus) {
      selectedLocations.push('NEW CAMPUS');
    }
    if (this.location.apiitTpm) {
      selectedLocations.push('TPM');
    }
    this.timetableProv.get().subscribe((res => {
      this.timetableData = res;
      for (let i = 0; i < this.timetableData.length; i++) {
        if (this.listOfClassrooms.indexOf(res[i].ROOM) === -1
          && selectedLocations.indexOf(res[i].LOCATION) !== -1) {
          if (this.typeOfRooms.classroom && this.location.newCampus
            && res[i].LOCATION === 'NEW CAMPUS' && res[i].ROOM.length === 7) { // If classroom e.g. B-07-08
            this.listOfClassrooms.push(res[i].ROOM);
          }
          if (this.typeOfRooms.classroom && this.location.apiitTpm
            && res[i].LOCATION === 'TPM' && res[i].ROOM.length === 8) { // If APIIT Lecture Halls e.g. L3-2
            this.listOfClassrooms.push(res[i].ROOM);
          }
          selectedTypeOfRooms.forEach(typeOfRoom => {
            if (res[i].ROOM.indexOf(typeOfRoom) !== -1) {
              this.listOfClassrooms.push(res[i].ROOM);
            }
          });
        }
      }
      this.listOfClassrooms.sort();
    }));
    if (this.selectedDay && this.selectedTime && this.selectedDuration) {
      this.presentLoading().then((_ => {
        switch (this.selectedDay) {
          case '1':
            this.searchTimetable('MON', this.selectedTime, this.selectedDuration * 60);
            break;
          case '2':
            this.searchTimetable('TUE', this.selectedTime, this.selectedDuration * 60);
            break;
          case '3':
            this.searchTimetable('WED', this.selectedTime, this.selectedDuration * 60);
            break;
          case '4':
            this.searchTimetable('THU', this.selectedTime, this.selectedDuration * 60);
            break;
          case '5':
            this.searchTimetable('FRI', this.selectedTime, this.selectedDuration * 60);
            break;
          case '6':
            this.searchTimetable('SAT', this.selectedTime, this.selectedDuration * 60);
            break;
        }
        this.loading.dismiss();
      }));
    } else {
      this.presentToast('Make sure you fill in everything!');
    }
  }

  checkIfLabClosed(timetable, selectedTimeFrom, selectedTimeTo) {
    // If Lab
    if (timetable.ROOM.toUpperCase().indexOf('LAB') !== -1) {
      // If selectedTimeFrom is after 07:00 PM
      if (selectedTimeFrom >
        (Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' ' +
          '19:00' + ':00') / 1000)) {
        return true;
      } else if (selectedTimeTo >
        (Date.parse(timetable.DATESTAMP_ISO.split('-').join('/') + ' '
          + '19:00' + ':00') / 1000)) {
        return true;
      }
    }
    return false;
  }

  searchTimetable(selectedDay, selectedTime, duration) {
    this.listOfFreeRooms = [];
    const occupiedRooms = [];
    this.timetableData.forEach(timetable => {
      if (timetable.DAY === selectedDay) {
        const timeFrom = Date.parse(timetable.DATESTAMP_ISO.split('-').join('/')
          + ' ' + this.convertTime12to24(timetable.TIME_FROM).toString() + ':00') / 1000;
        const timeTo = Date.parse(timetable.DATESTAMP_ISO.split('-').join('/')
          + ' ' + this.convertTime12to24(timetable.TIME_TO).toString() + ':00') / 1000;
        const selectedTimeFrom = Date.parse(timetable.DATESTAMP_ISO.split('-').join('/')
          + ' ' + selectedTime + ':00') / 1000;
        const selectedTimeTo = selectedTimeFrom + duration;
        if ((selectedTimeFrom <= timeFrom && timeFrom < selectedTimeTo)
          || (selectedTimeFrom <= timeTo && timeTo < selectedTimeTo)
          || this.checkIfLabClosed(timetable, selectedTimeFrom, selectedTimeTo)) {
          // If class is used at that time
          if (occupiedRooms.indexOf(timetable.ROOM) === -1) {
            occupiedRooms.push(timetable.ROOM);
          }
        }
      }
    });
    this.listOfFreeRooms = this.listOfClassrooms.filter(el => occupiedRooms.indexOf(el) === -1);
  }

  convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    const [hours, minutes] = time.split(':');
    let displayedHours = hours;
    if (hours === '12') {
      displayedHours = '00';
    }
    if (modifier === 'PM') {
      displayedHours = parseInt(hours, 10) + 12;
    }
    return displayedHours + ':' + minutes;
  }

  getTodayDate() {
    const today = new Date();
    let dd = today.getDate().toString();
    let mm = (today.getMonth() + 1).toString(); // January is 0!
    const yyyy = today.getFullYear();

    if (parseInt(dd, 10) < 10) {
      dd = '0' + dd.toString();
    }

    if (parseInt(mm, 10) < 10) {
      mm = '0' + mm;
    }

    return mm + '/' + dd + '/' + yyyy;
  }

}

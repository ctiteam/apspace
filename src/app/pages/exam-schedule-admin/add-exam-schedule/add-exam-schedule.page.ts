import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-add-exam-schedule',
  templateUrl: './add-exam-schedule.page.html',
  styleUrls: ['./add-exam-schedule.page.scss'],
})
export class AddExamSchedulePage implements OnInit {
  @Input() edit: boolean;
  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };
  searchTerm = '';
  items: any;

  tests = [
    {
      value: '1Lorem Ipsum'
    },
    {
      value: '2Lorem Ipsum'
    },
    {
      value: '3Lorem Ipsum'
    },
    {
      value: '4Lorem Ipsum'
    },
    {
      value: '5Lorem Ipsum'
    },
    {
      value: '6Lorem Ipsum'
    },
    {
      value: 'Lorem 7Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem 8Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem 9Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ip10sum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lo11rem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    },
    {
      value: 'Lorem Ipsum'
    }
  ];

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.setFilteredItems();
  }

  filterItems(searchTerm) {
    return this.tests.filter(test => {
      return test.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-intake',
  templateUrl: './add-intake.page.html',
  styleUrls: ['./add-intake.page.scss'],
})
export class AddIntakePage implements OnInit {
  @Input() onEdit: boolean;
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

  filterItems(searchTerm) {
    return this.tests.filter(test => {
      return test.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);
  }
}

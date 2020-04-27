import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-add-exam-schedule',
  templateUrl: './add-exam-schedule.page.html',
  styleUrls: ['./add-exam-schedule.page.scss'],
})
export class AddExamSchedulePage implements OnInit {
  @Input() onEdit: boolean;

  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };
  searchTerm = '';
  items: any;

  addExamScheduleForm: FormGroup;
  selectedModule;
  modules = [];

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

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setFilteredItems();

    this.addExamScheduleForm = this.formBuilder.group({
      publicationDate: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      remarks: ['']
    });

    if (this.onEdit) {
      this.modules = [
        {
          title: '1Lorem Ipsum',
          value: '1loremipsum'
        },
        {
          title: '2Lorem Ipsum',
          value: '2loremipsum'
        },
        {
          title: '3Lorem Ipsum',
          value: '3loremipsum'
        }
      ];

      this.selectedModule = {
        title: '2Lorem Ipsum',
        value: '2loremipsum'
      };
    }

    this.addExamScheduleForm.valueChanges.subscribe(value => console.log(value));
  }

  moduleChange(value) {
    this.selectedModule = this.modules.find(module => module.value === value);
    console.log(this.selectedModule);
  }

  getSelectedModules(moduleObject: any) {
    if (!(this.modules.find(module => module.value === moduleObject.value))) {
      this.modules.push(moduleObject);
    } else {
      this.modules.forEach((module, index) => {
        if (module.value === moduleObject.value) {
          this.modules.splice(index, 1);
        }
      });
    }
  }

  filterItems(searchTerm) {
    return this.tests.filter(test => {
      return test.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);
  }

  submit() {
    console.log(this.addExamScheduleForm.value);
    console.log(this.modules);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}

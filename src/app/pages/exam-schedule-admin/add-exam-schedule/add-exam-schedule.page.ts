import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-add-exam-schedule',
  templateUrl: './add-exam-schedule.page.html',
  styleUrls: ['./add-exam-schedule.page.scss'],
})
export class AddExamSchedulePage implements OnInit {
  @Input() onEdit: boolean;

  type = 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  searchTerm = '';
  modulesToBeSearched = [];

  examScheduleForm: FormGroup;
  selectedModule;

  modules = [
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
      value: '7Lorem Ipsum'
    },
    {
      value: '8Lorem Ipsum'
    },
    {
      value: '9Lorem Ipsum'
    },
    {
      value: '10Lorem Ipsum'
    }
  ];

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setFilteredItems();

    this.examScheduleForm = this.formBuilder.group({
      publicationDate: ['', Validators.required],
      module: this.initializeModule(),
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      remarks: ['']
    });

    this.examScheduleForm.valueChanges.subscribe(value => console.log(value));
  }

  initializeModule() {
    if (!(this.onEdit)) {
      return this.formBuilder.array([], [Validators.required]);
    } else {
      this.selectedModule = '4Lorem Ipsum';
      return [this.selectedModule, Validators.required];
    }
  }

  get moduleArray() {
    return this.examScheduleForm.get('module') as FormArray;
  }

  addSelectedModules(moduleObject: any) {
    if (!(this.moduleArray.value.find(module => module.value === moduleObject.value))) {
      this.moduleArray.push(this.formBuilder.group({
        value: [moduleObject.value, Validators.required],
      }));
    } else {
      this.moduleArray.removeAt(this.moduleArray.value.findIndex(module => module.value === moduleObject.value));
    }
  }

  filterItems(searchTerm) {
    return this.modules.filter(module => {
      return module.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.modulesToBeSearched = this.filterItems(this.searchTerm);
  }

  submit() {
    console.log(this.examScheduleForm.value);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}

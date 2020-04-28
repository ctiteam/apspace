import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-intake',
  templateUrl: './add-intake.page.html',
  styleUrls: ['./add-intake.page.scss'],
})
export class AddIntakePage implements OnInit {
  @Input() onEdit: boolean;

  searchTerm = '';
  intakesToBeSearched = [];

  intakeForm: FormGroup;
  selectedIntake;

  intakes = [
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
    },
  ];

  types = [
    'Lorem Ipsum1',
    'Lorem Ipsum2',
    'Lorem Ipsum3'
  ];

  locations = [
    'Lorem Ipsum1',
    'Lorem Ipsum2',
    'Lorem Ipsum3'
  ];

  constructor(
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setFilteredItems();

    this.intakeForm = this.formBuilder.group({
      intake: this.initializeIntake(),
      type: ['', Validators.required],
      location: ['', Validators.required],
      venue: ['', Validators.required],
      docketIssuance: ['', Validators.required],
      examResultDate: ['', Validators.required]
    });

    this.intakeForm.valueChanges.subscribe(console.log);
  }

  initializeIntake() {
    if (!(this.onEdit)) {
      return this.formBuilder.array([], [Validators.required]);
    } else {
      this.selectedIntake = '4Lorem Ipsum';
      return [this.selectedIntake, Validators.required];
    }
  }

  get intakeArray() {
    return this.intakeForm.get('intake') as FormArray;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  submit() {
    console.log(this.intakeForm.value);
  }

  addSelectedIntakes(intakeObject: any) {
    if (!(this.intakeArray.value.find(intake => intake.value === intakeObject.value))) {
      this.intakeArray.push(this.formBuilder.group({
        value: [intakeObject.value, Validators.required],
      }));
    } else {
      this.intakeArray.removeAt(this.intakeArray.value.findIndex(intake => intake.value === intakeObject.value));
    }
  }

  filterItems(searchTerm) {
    return this.intakes.filter(intake => {
      return intake.value.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.intakesToBeSearched = this.filterItems(this.searchTerm);
  }
}

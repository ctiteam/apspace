import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  addIntakeForm: FormGroup;
  intakes = [];

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

    this.addIntakeForm = this.formBuilder.group({
      intake: [''],
      type: ['', Validators.required],
      location: ['', Validators.required],
      venue: ['', Validators.required],
      docketIssuance: ['', Validators.required],
      examResultDate: ['', Validators.required]
    });

    this.addIntakeForm.valueChanges.subscribe(console.log);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  submit() {
    console.log(this.addIntakeForm.value);
  }

  getSelectedIntakes(intakeObject) {
    if (!(this.intakes.find(intake => intake.value === intakeObject.value))) {
      this.intakes.push(intakeObject);
    } else {
      this.intakes.forEach((module, index) => {
        if (module.value === intakeObject.value) {
          this.intakes.splice(index, 1);
        }
      });
    }

    console.log(this.intakes);
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

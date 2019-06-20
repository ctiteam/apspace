import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.page.html',
  styleUrls: ['./add-student.page.scss'],
})
export class AddStudentPage {

  addStudentForm = this.formBuilder.array([
    this.createStudentItem()
  ]);

  constructor(private formBuilder: FormBuilder) { }

  createStudentItem() {
    return this.formBuilder.group({
      student_id: ['', Validators.required]
    });
  }

  addStudentItem() {
    this.addStudentForm.push(this.createStudentItem());
  }

  removeStudentItem(index) {
    this.addStudentForm.removeAt(index);
  }

  confirm() {
    if (this.addStudentForm.valid) {
      console.log(this.addStudentForm.value);
    }
  }

}

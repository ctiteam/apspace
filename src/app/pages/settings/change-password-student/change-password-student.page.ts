import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { ChangePasswordService } from '../../../services';
import { PasswordValidator } from '../../../validators/password.validator';

@Component({
  selector: 'app-change-password-student',
  templateUrl: './change-password-student.page.html',
  styleUrls: ['./change-password-student.page.scss'],
})
export class ChangePasswordStudentPage implements OnInit {

  stuedentDetails;
  changePasswordStudentForm: FormGroup;
  showDetails: boolean;


  constructor(
    private changePasswordService: ChangePasswordService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getStudent();
    this.changePasswordStudentForm = new FormGroup({

      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%~()_{}-]).{8,}')
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%~()_{}-]).{8,}')
      ]),
    }
      , { validators: PasswordValidator }
    );
  }
  getStudent() {
    this.changePasswordService.getStudent()
      .subscribe(
        (data: { attributes: {sAMAccountName: string} }) => (
          this.stuedentDetails = data.attributes.sAMAccountName,
          console.log(data.attributes)
        )
      );
  }


  changePasswordStudeent() {
    this.changePasswordService
      .changePasswordStudent(
        this.changePasswordStudentForm.value).subscribe(
          (res: {result: string}) => {
            console.log(res.result);
            const alert = this.alertController.create({
              header: 'Success!',
              subHeader: 'Your Password has been changed! ',
              message: '<ion-icon name="checkmark-circle"></ion-icon>',
              animated: true,
              buttons:
                [
                  {
                    text: 'OK',
                    cssClass: 'secondary',
                    handler: () => {
                      this.router.navigate(['/logout']);
                    }
                  }
                ]

            });
            alert.then(param => param.present());
          },


        );
  }

}

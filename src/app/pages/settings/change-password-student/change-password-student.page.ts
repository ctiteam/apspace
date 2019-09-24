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
  newPassword = '';
  length = false;
  upperCase = false;
  special = false;



  constructor(
    private changePasswordService: ChangePasswordService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.changePasswordStudentForm = new FormGroup({

      newPassword: new FormControl('', [
        Validators.required,
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
      ]),
    }
      , { validators: PasswordValidator }
    );
  }
  changePasswordStudeent() {
    this.changePasswordService
      .changePasswordStudent(
        this.changePasswordStudentForm.value).subscribe(
          (res: { result: string }) => {
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
  checkValidation() {
    const regexp = /^(?=.*?[A-Z])/;
    const special = /(?=.*?[#?!@$%~()_{}-])/;
    if (regexp.test(this.newPassword)) {
      this.upperCase = true;
    } else {
      this.upperCase = false;
    }
    if (this.newPassword.length < 8) {
      this.length = false;
    } else {
      this.length = true;
    }
    if (special.test(this.newPassword)) {
       this.special = true;
    } else {
      this.special = false;
    }
  }
}

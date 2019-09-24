import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { PasswordValidator } from '../../../validators/password.validator';
import { ChangePasswordService } from '../../../services/change-password.service';

@Component({
  selector: 'app-change-password-staff',
  templateUrl: './change-password-staff.page.html',
  styleUrls: ['./change-password-staff.page.scss'],
})
export class ChangePasswordStaffPage implements OnInit {

  userDetails;
  changePasswordForm: FormGroup;
  showDetails: boolean;
  newPpassword = '';
  length = false;
  upperCase = false;
  special = false;


  constructor(
    private changePasswordService: ChangePasswordService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      newPpassword: new FormControl('', [
        Validators.required,
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
      ]),
    }
      , { validators: PasswordValidator }
    );
  }
  changePassword() {
    this.changePasswordService
      .changePassword(
        this.changePasswordForm.value).subscribe(
          (res: { result: string }) => {
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
    if (regexp.test(this.newPpassword)) {
      this.upperCase = true;
    } else {
      this.upperCase = false;
    }
    if (this.newPpassword.length < 8) {
      this.length = false;
    } else {
      this.length = true;
    }
    if (special.test(this.newPpassword)) {
      this.special = true;

    } else {
      this.special = false;
    }
  }
}

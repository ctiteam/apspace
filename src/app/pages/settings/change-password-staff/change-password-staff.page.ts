import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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


  constructor(
    private changePasswordService: ChangePasswordService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser();
    this.changePasswordForm = new FormGroup({

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
  getUser() {
    this.changePasswordService.getUser()
      .subscribe(
        data => (
          this.userDetails = data['attributes']['sAMAccountName'],
          console.log(data['attributes'])
        )
      );
  }


  changePassword() {
    console.log(this.changePasswordForm.value);
    this.changePasswordService
      .changePassword(
        this.changePasswordForm.value).subscribe(
          res => {
            console.log(res['result']);
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
            alert.then(alert => alert.present());
          },


        );
  }

}

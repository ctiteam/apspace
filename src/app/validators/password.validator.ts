import { AbstractControl } from '@angular/forms';

export function PasswordValidator(control: AbstractControl): { [key: string]: boolean} | null {
    const password = control.get('new_password');
    const confirmPassword = control.get('confirm_password');
    if (password.pristine || confirmPassword.pristine) {
        return null;
    }
    return password && confirmPassword && password.value !== confirmPassword.value ?
    { mismatch: true} :
    null;
}


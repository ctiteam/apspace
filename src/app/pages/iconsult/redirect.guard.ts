import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage';

import { Role } from '../../interfaces';

/**
 * Redirect the user landing in /iconsult based on their role.
 *
 * Students will be redirected to /my-appointments
 * Staffs will be redirected to /my-consultations
 */
@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {

  constructor(private storage: Storage, private router: Router) { }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<UrlTree> {
    return this.storage.get('role').then((role: Role) => {
      // tslint:disable-next-line:no-bitwise
      const path = role & Role.Student ? 'my-appointments' : 'my-consultations';
      return this.router.createUrlTree([state.url, path]);
    });
  }

}

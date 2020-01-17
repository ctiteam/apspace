import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Role } from '../../interfaces';
import { SettingsService } from '../../services';

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

  constructor(private settings: SettingsService, private router: Router) { }

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree {
    // tslint:disable-next-line:no-bitwise
    const path = this.settings.get('role') & Role.Student ? 'my-appointments' : 'my-consultations';
    return this.router.createUrlTree([state.url, path]);
  }

}

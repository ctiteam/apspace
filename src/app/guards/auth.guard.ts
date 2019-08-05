import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { CasTicketService, SettingsService } from '../services';

/**
 * Auth Guard check if the user is authenticated and authorized.
 *
 * Redirect the user to /login if not logged in.
 * Prevent entering a page if not authorized if route data exist.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private cas: CasTicketService,
    private settings: SettingsService,
    private router: Router,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // authentication
    if (!await this.cas.isAuthenticated()) {
      if (route.url.toString() === 'tabs') {  // first login need not to show redirect
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login'], { queryParams: { redirect: state.url } });
      }
      return false;
    }

    // authorization
    // tslint:disable-next-line:no-bitwise
    if (route.data.role && !(route.data.role & this.settings.get('role'))) {
      return false;
    }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

}

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router,
  RouterStateSnapshot, UrlTree
} from '@angular/router';

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

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<UrlTree | boolean> {
    await this.settings.ready();

    // authentication
    if (!await this.cas.isAuthenticated()) {
      // does not need to redirect on first login and for logout page
      return route.url.toString() === 'tabs' || route.url.toString() === 'logout'
        ? this.router.createUrlTree(['/login'])
        : this.router.createUrlTree(['/login'], { queryParams: { redirect: state.url }});
    }

    // authorization
    // tslint:disable-next-line:no-bitwise
    if (route.data.role && !(route.data.role & this.settings.get('role'))) {
      return this.router.createUrlTree(['/unauthorized']);
    }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<UrlTree | boolean> {
    return this.canActivate(route, state);
  }

}

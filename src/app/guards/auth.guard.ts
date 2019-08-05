import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

import { CasTicketService } from '../services';

/**
 * Auth Guard to redirect the user to /login if not logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private cas: CasTicketService, private router: Router) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!await this.cas.isAuthenticated()) {
      if (next.url.toString() === 'tabs') {  // first login need not to show redirect
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login'], { queryParams: { redirect: state.url } });
      }
      return false;
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { CasTicketService } from '../services';

/**
 * Auth Guard to redirect the user to /login if not logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private cas: CasTicketService, private router: Router) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!await this.cas.isAuthenticated()) {
      // TODO: find full path replacement for next
      if (next.url.toString() === 'tabs') {  // first login need not to show redirect
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login'], { queryParams: { redirect: next.url } });
      }
      return false;
    }
    // TODO: check authorization
    return true;
  }
}

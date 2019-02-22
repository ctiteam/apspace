import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

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
    if (!await this.cas.isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    // TODO: check authorization
    return true;
  }
}

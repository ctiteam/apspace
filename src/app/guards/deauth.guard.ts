import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CasTicketService } from '../services';

/**
 * Deauth Guard to redirect the user to / if logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class DeauthGuard implements CanActivate {

  constructor(private cas: CasTicketService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    if (await this.cas.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}

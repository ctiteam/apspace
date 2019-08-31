import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SettingsService } from '../services';
import { Role } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(
    private settings: SettingsService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    await this.settings.ready();

    const role = route.data.role;
    const userRole = this.settings.get('role');

    if (userRole !== role) {
      return false;
    }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

  fallback(userRole: number) {
    if (userRole === Role.Student) {
      this.router.navigate(['iconsult', 'my-appointments']);
    } else if (userRole === Role.Lecturer || userRole === Role.Admin) {
      this.router.navigate(['iconsult', 'my-consultations']);
    }
  }

}

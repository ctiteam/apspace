import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, PRIMARY_OUTLET, Router,
  RouterStateSnapshot, UrlSegment, UrlTree
} from '@angular/router';

import { SettingsService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class AttendixNewGuard implements CanActivate {

  constructor(private settings: SettingsService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const newRoute = this.settings.get('attendixv1') || false;
    if (Boolean(route.url[0] && route.url[0].path === 'new') === newRoute) {
      return true;
    }
    // redirect to correct route
    const tree = this.router.parseUrl(state.url);
    const segments = tree.root.children[PRIMARY_OUTLET].segments;
    if (newRoute) { // mimic queryParamsHandling: "preserve" behavior
      segments.push(new UrlSegment('new', segments[segments.length - 1].parameters));
      segments[segments.length - 2].parameters = {};
    } else {
      segments.pop();
    }
    return tree;
  }

}

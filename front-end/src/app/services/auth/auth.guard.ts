import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (await this.isUserAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }

  private isUserAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        const authorization = localStorage.getItem('token');
        if (authorization) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }
}

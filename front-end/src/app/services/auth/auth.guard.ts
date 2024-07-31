import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (await this.isUserAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }

  private isUserAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      const autorization = localStorage.getItem('token');
      console.log(autorization)
      if (autorization) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
}
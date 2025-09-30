import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AppUserDetailsComponent } from 'src/app/pages/admin/app-user/app-user-details/app-user-details.component';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AppUserResolver implements Resolve<AppUserDetailsComponent> {
  constructor(private _service: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this._service.getUserDetail({ "userId": parseInt(route.params.id) });
  }
}

import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SettingsService } from '../services/settings.service';
import { SettingsNewComponent } from 'src/app/pages/admin/settings/settings-new/settings-new.component';

@Injectable({
  providedIn: 'root'
})
export class SettingsResolver implements Resolve<SettingsNewComponent> {

  constructor(private service: SettingsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.detail(parseInt(route.params.id));
  }
}
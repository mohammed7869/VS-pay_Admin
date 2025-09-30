import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MasterValueNewComponent } from 'src/app/pages/admin/master-value/master-value-new/master-value-new.component';
import { MasterValueService } from '../services/master-value.service';

@Injectable({
  providedIn: 'root'
})

export class MasterValueDetailsResolver implements Resolve<MasterValueNewComponent> {

  constructor(private groupServiceService: MasterValueService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.groupServiceService.detail(parseInt(route.params.id));
  }
}
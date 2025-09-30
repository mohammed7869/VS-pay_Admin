import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IfscCodeNewComponent } from 'src/app/pages/admin/ifsc-code/ifsc-code-new/ifsc-code-new.component';
import { IfscCodeService } from '../services/ifsc-code.service';

@Injectable({
  providedIn: 'root'
})
export class IfscCodeResolver implements Resolve<IfscCodeNewComponent> {

  constructor(private groupServiceService: IfscCodeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.groupServiceService.detail(parseInt(route.params.id));
  }
}
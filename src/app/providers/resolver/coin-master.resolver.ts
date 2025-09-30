import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoinMasterNewComponent } from 'src/app/pages/admin/coin-master/coin-master-new/coin-master-new.component';
import { CoinMasterService } from '../services/coin-master.service';

@Injectable({
  providedIn: 'root'
})
export class CoinMasterResolver implements Resolve<CoinMasterNewComponent> {

  constructor(private service: CoinMasterService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.service.detail(parseInt(route.params.id));
  }
}
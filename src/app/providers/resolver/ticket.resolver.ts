import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { TicketNewComponent } from 'src/app/pages/applicant/ticket/ticket-new/ticket-new.component';
import { TicketService } from '../services/ticket.service';

@Injectable({
  providedIn: 'root'
})
export class TicketResolver implements Resolve<TicketNewComponent> {

  constructor(private groupServiceService: TicketService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.groupServiceService.detail(parseInt(route.params.id));
  }
}
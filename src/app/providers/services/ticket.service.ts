import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/Ticket`;

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private httpClient: HttpClient) { }

  applicantList(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/ApplicantList`, fdata);
  }

  adminList(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/AdminList`, fdata);
  }

  auditorList(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/AuditorList`, fdata);
  }

  applicantAddTicket(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/ApplicantAddTicket`, fdata);
  }

  adminAddTicket(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/AdminAddTicket`, fdata);
  }

  auditorToAdminTicket(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/AuditorToAdminTicket`, fdata);
  }

  auditorToApplicantTicket(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/AuditorToApplicantTicket`, fdata);
  }

  getNextTicketNo(): Observable<any> {
    return this.httpClient.post(`${baseURL}/GetNextTicketNo`, null);
  }

  replyMessage(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/ReplyMessage`, fdata);
  }

  export(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/Export`, fdata);
  }
}

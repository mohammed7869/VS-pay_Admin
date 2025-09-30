import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/AuditorTicket`;

@Injectable({
  providedIn: 'root'
})
export class AuditorTicketService {

  constructor(private httpClient: HttpClient) { }

  list(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/List`, fdata);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/Add`, data);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/Delete`, id);
  }

  detail(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/Get`, id);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/Update`, data);
  }

  dropdownList(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/DropDownList`, fdata);
  }
}

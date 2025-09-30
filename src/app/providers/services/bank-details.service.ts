import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/BankDetails`;

@Injectable({
  providedIn: 'root'
})
export class BankDetailsService {

  constructor(private httpClient: HttpClient) { }

  list(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/List`, fdata);
  }

  adminList(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/AdminList`, fdata);
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

  approveBankDetails(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/ApproveBankDetails`, id);
  }

  export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.httpClient.post<any>(`${baseURL}/Export`, fdata, header);
  }
}

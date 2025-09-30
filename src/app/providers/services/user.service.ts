import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = `${environment.apiUrl}/user`;
const apiURL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  list(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/list`, fdata);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/create`, data);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/delete`, id);
  }

  detail(id: number): Observable<any> {
    return this.httpClient.get(`${baseURL}/Get`+ id);
  }

  update(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/Update`, data);
  }

  userWalletBalance(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/userWalletBalance`, data);
  }

  TopUp(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/TopUp`, data);
  }

  getPendingTopUps(): Observable<any> {
    return this.httpClient.post(`${apiURL}/vstransaction/admin/pendingTopUps`, {});
  }

  approveTopUp(data: any): Observable<any> {
    return this.httpClient.post(`${apiURL}/vstransaction/admin/approveTopUp`, data);
  }

  rejectTopUp(data: any): Observable<any> {
    return this.httpClient.post(`${apiURL}/vstransaction/admin/rejectTopUp`, data);
  }

  dropdownList(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/DropDownList`, fdata);
  }

  export(fdata: any): Observable<any> {
    var header: any = { headers: { Accept: "application/octet-stream" }, responseType: "blob" };
    return this.httpClient.post<any>(`${baseURL}/Export`, fdata, header);
  }

  userPermissionList(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/UserPermissionList`, fdata);
  }

  permissionList(): Observable<any> {
    return this.httpClient.post(`${baseURL}/PermissionList`, null);
  }

  updatePermissions(fdata: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/UpdatePermissions`, fdata);
  }

  getUserDetail(id: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/admin/getUserDetail`, id);
  }

  transferCoins(id: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/admin/transferCoins`, id);
  }
}
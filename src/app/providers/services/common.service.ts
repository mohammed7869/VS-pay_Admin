import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

const baseURL = `${environment.apiUrl}/Common`;

@Injectable({
  providedIn: 'root'
})


export class CommonService {

  public appCommon = appCommon;

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) { }

  getUserData(): any { return this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo); }

  adminDashboardResult(): Observable<any> {
    return this.httpClient.post(`${baseURL}/AdminDashboardResult`, {});
  }

  applicantDashboardResult(): Observable<any> {
    return this.httpClient.post(`${baseURL}/ApplicantDashboardResult`, {});
  }

  applicantDashboardApplicationList(data): Observable<any> {
    return this.httpClient.post(`${baseURL}/ApplicantDashboardApplicationList`, data);
  }

  adminDashboardApplicationList(data): Observable<any> {
    return this.httpClient.post(`${baseURL}/AdminDashboardApplicationList`, data);
  }

  getJamaatData(): Observable<any> {
    return this.httpClient.get("assets/jamaat.csv", { responseType: 'text' });
  }

  listtransaction(data): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/vstransaction/admin/listtransaction`, data);
  }

  lockUnlockCoins(data): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/user/admin/updateCoins`, data);
  }  

  getCoinTransferDetails(data): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/coinlog/admin/getCoinTransferDetails`, data);
  }
}

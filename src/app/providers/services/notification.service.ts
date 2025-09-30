import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseURL = `${environment.apiUrl}/Notification`;
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient) { }

  notificationList(fdata): Observable<any> {
    return this.httpClient.post(`${baseURL}/NotificationList`, fdata);
  }

  unreadNotificationList(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/UnreadNotificationList`, data);
  }

  dashboardNotificationList(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/DashboardNotificationList`, data);
  }

  detail(id: number): Observable<any> {
    return this.httpClient.post(`${baseURL}/Get`, id);
  }

  markReadNotification(data: any): Observable<any> {
    return this.httpClient.post(`${baseURL}/MarkReadNotification`, data);
  }

  markReadAllNotification(): Observable<any> {
    return this.httpClient.post(`${baseURL}/MarkReadAllNotification`, null);
  }
}
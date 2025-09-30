import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { NotificationResolver } from 'src/app/providers/resolver/notification.resolver';



@NgModule({
  declarations: [
    NotificationDetailsComponent,
    NotificationListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationListComponent,
        children: [
          {
            path: 'details/:id',
            component: NotificationDetailsComponent,
            resolve: {
              recordData: NotificationResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class NotificationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterValueNewComponent } from './master-value-new/master-value-new.component';
import { MasterValueSearchComponent } from './master-value-search/master-value-search.component';
import { RouterModule } from '@angular/router';
import { MasterValueDetailsResolver } from 'src/app/providers/resolver/master-value-details.resolver';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAlertModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { MasterValueQuickAddComponent } from './master-value-quick-add/master-value-quick-add.component';



@NgModule({
  declarations: [
    MasterValueNewComponent,
    MasterValueSearchComponent,
    MasterValueQuickAddComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    NgbAlertModule,
    RouterModule.forChild([
      {
        path: '',
        component: MasterValueSearchComponent,
        children: [
          {
            path: 'new',
            component: MasterValueNewComponent
          },
          {
            path: 'edit/:id',
            component: MasterValueNewComponent,
            resolve: {
              recordData: MasterValueDetailsResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class MasterValueModule { }

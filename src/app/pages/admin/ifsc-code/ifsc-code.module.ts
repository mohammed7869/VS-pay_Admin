import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfscCodeNewComponent } from './ifsc-code-new/ifsc-code-new.component';
import { IfscCodeSearchComponent } from './ifsc-code-search/ifsc-code-search.component';
import { RouterModule } from '@angular/router';
import { IfscCodeResolver } from 'src/app/providers/resolver/ifsc-code.resolver';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAlertModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    IfscCodeNewComponent,
    IfscCodeSearchComponent
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
        component: IfscCodeSearchComponent,
        children: [
          {
            path: 'new',
            component: IfscCodeNewComponent
          },
          {
            path: 'edit/:id',
            component: IfscCodeNewComponent,
            resolve: {
              recordData: IfscCodeResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class IfscCodeModule { }

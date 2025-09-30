import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketSearchComponent } from './ticket-search/ticket-search.component';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAlertModule, NgbCollapseModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    TicketSearchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    NgbTypeaheadModule,
    NgbAlertModule,
    RouterModule.forChild([
      {
        path: '',
        component: TicketSearchComponent,
      },
    ]),
    AgGridModule
  ]
})
export class TicketModule { }

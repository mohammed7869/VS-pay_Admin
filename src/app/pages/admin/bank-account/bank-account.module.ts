import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountsSearchComponent } from './bank-accounts-search/bank-accounts-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    BankAccountsSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: BankAccountsSearchComponent,
      }
    ]),
    AgGridModule
  ]
})
export class BankAccountModule { }

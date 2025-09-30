import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TopupApprovalRoutingModule } from './topup-approval-routing.module';
import { TopupApprovalListComponent } from './topup-approval-list/topup-approval-list.component';

@NgModule({
  declarations: [
    TopupApprovalListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TopupApprovalRoutingModule
  ]
})
export class TopupApprovalModule { }

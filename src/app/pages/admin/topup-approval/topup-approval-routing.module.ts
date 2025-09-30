import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopupApprovalListComponent } from './topup-approval-list/topup-approval-list.component';

const routes: Routes = [
  {
    path: '',
    component: TopupApprovalListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopupApprovalRoutingModule { }

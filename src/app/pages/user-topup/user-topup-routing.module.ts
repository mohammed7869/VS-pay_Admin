import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserTopupComponent } from './user-topup.component';

const routes: Routes = [
  {
    path: '',
    component: UserTopupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserTopupRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ForgetPasswordOtpComponent } from './forget-password-otp/forget-password-otp.component';
import { ForgetPasswordResetComponent } from './forget-password-reset/forget-password-reset.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLoginComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'forget-password-otp',
    component: ForgetPasswordOtpComponent
  },
  {
    path: 'forget-password-reset',
    component: ForgetPasswordResetComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

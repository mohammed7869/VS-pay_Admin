import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from '../../shared/ui/ui.module';
import { AuthRoutingModule } from './auth-routing';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ForgetPasswordOtpComponent } from './forget-password-otp/forget-password-otp.component';
import { ForgetPasswordResetComponent } from './forget-password-reset/forget-password-reset.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

@NgModule({
  declarations: [ForgetPasswordComponent, ForgetPasswordOtpComponent, ForgetPasswordResetComponent, AdminLoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UiModule,
    AuthRoutingModule,
    FormsModule
  ]
})
export class AuthModule { }

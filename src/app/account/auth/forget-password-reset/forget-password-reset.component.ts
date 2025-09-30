import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { ComparePassword } from 'src/app/validators/customvalidator.validator';
import { Location } from '@angular/common';
@Component({
  selector: 'app-forget-password-reset',
  templateUrl: './forget-password-reset.component.html',
  styleUrls: ['./forget-password-reset.component.scss']
})
export class ForgetPasswordResetComponent implements OnInit {

  forgetPasswordResetForm: FormGroup;
  submitted = false;
  isBtnLoading: boolean = false;
  public appCommon = appCommon;
  Otp: any;
  email: any;

  // set the currenr year
  year: number = new Date().getFullYear();
  error = '';

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,) {

    this.createForgetPasswordResetForm();

  }

  ngOnInit() {
    this.Otp = this.localStorageService.getItem(appCommon.LocalStorageKeyType.Otp);
    this.email = this.localStorageService.getItem(appCommon.LocalStorageKeyType.Email);
  }


  createForgetPasswordResetForm(): void {
    this.forgetPasswordResetForm = this.formBuilder.group(
      {
        password: [null, [Validators.required, Validators.minLength(6)]],
        confirmPassword: [null, [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: ComparePassword("password", "confirmPassword")
      }
    );
  }

  get formData() { return this.forgetPasswordResetForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isBtnLoading = true;

    if (this.formData.password.value != this.formData.confirmPassword.value) {
      alert("Password & Confirm Password doesn't match");
    }

    if (this.forgetPasswordResetForm.invalid) {
      this.isBtnLoading = false;
      return;
    }
    else {
      var fdata = { 'email': this.email, 'token': this.Otp, 'password': this.formData.password.value, 'confirmPassword': this.formData.confirmPassword.value }
      this.authService.resetforgetpassword(fdata)
        .subscribe(
          data => {
            if (!data.hasError) {
              this.toastrMessageService.showSuccess("Password reset successfully. Login to continue...", "Success");
              this.localStorageService.removeItem(this.appCommon.LocalStorageKeyType.Otp);
              this.localStorageService.removeItem(this.appCommon.LocalStorageKeyType.Email);
              this.router.navigateByUrl('/login');
            }
            else {
              this.error = data.message;
              this.toastrMessageService.showError(data.message, "Invalid");
              this.submitted = false;
              this.isBtnLoading = false;
            }
          },
          error => {
            this.error = error.message;
            this.toastrMessageService.showInfo(error.message, "Info");
            this.isBtnLoading = false;
            this.submitted = false;
          }
        )
    }
  }
}

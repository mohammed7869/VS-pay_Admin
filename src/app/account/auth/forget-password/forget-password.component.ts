import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPasswordForm: FormGroup;
  submitted = false;
  isBtnLoading: boolean = false;
  public appCommon = appCommon;
  error = '';

  // set the currenr year
  year: number = new Date().getFullYear();

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    private _location: Location) {}

  ngOnInit() {
    this.createForgetPasswordForm();
  }


  createForgetPasswordForm(): void {
    this.forgetPasswordForm = this.formBuilder.group(
      {
        email: [null, Validators.required],
      });
  }

  get formData() { return this.forgetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isBtnLoading = true;

    console.log(this.forgetPasswordForm.invalid);

    // stop here if form is invalid
    if (this.forgetPasswordForm.invalid) {
      this.isBtnLoading = false;
      return;
    }
    else {

      var fdata = this.formData.email.value;
      this.authService.forgetpassword(fdata)
        .subscribe(
          data => {
            this.toastrMessageService.showSuccess("OTP send to your registered email id.", "Success");
            this.localStorageService.setItem(this.appCommon.LocalStorageKeyType.Email, this.formData.email.value);
            this.router.navigateByUrl('/auth/forget-password-otp');
            this.isBtnLoading = false;
            this.submitted = false;
          },
          error => {
            this.error = error.message;
            this.submitted = false;
            this.isBtnLoading = false;
          }
        )
      this.isBtnLoading = false;
    }
  }


  onBackClick() {
    this.router.navigate(['']);
  }
}

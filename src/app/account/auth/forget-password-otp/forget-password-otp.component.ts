import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appCommon } from 'src/app/common/_appCommon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
@Component({
  selector: 'app-forget-password-otp',
  templateUrl: './forget-password-otp.component.html',
  styleUrls: ['./forget-password-otp.component.scss']
})
export class ForgetPasswordOtpComponent implements OnInit {

  otpForm: FormGroup;
  submitted = false;
  isOTPSend = false;
  isBtnLoading: boolean = false;
  isResendBtnLoading: boolean = false;
  email: any;
  public appCommon = appCommon;
  @ViewChild('field1') field1: ElementRef;
  @ViewChild('field2') field2: ElementRef;
  @ViewChild('field3') field3: ElementRef;
  @ViewChild('field4') field4: ElementRef;
  @ViewChild('field5') field5: ElementRef;
  @ViewChild('field6') field6: ElementRef;

  // set the currenr year
  year: number = new Date().getFullYear();
  error = '';

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthServiceService,
    private toastrMessageService: ToastrMessageService,
    private localStorageService: LocalStorageService,
    private _location: Location) {
    this.email = this.localStorageService.getItem(appCommon.LocalStorageKeyType.Email);
    this.createOtpForm();
  }

  ngOnInit() { }

  createOtpForm(): void {
    this.otpForm = this.formBuilder.group(
      {
        otp: ["", [Validators.required, Validators.minLength(6)]],
        // field1: [null, Validators.required],
        // field2: [null, Validators.required],
        // field3: [null, Validators.required],
        // field4: [null, Validators.required],
        // field5: [null, Validators.required],
        // field6: [null, Validators.required],
      });
  }

  get formData() { return this.otpForm.controls; }


  onSubmit() {
    this.submitted = true;

    console.log(this.otpForm.invalid);
    if (this.otpForm.invalid) {
      return;
    }
    else {
      this.isBtnLoading = true;
      var fdata = { 'token': this.formData.otp.value.toString(), 'email': this.email }
      //this.authService.verifyOtpUser(this.formData.field1.value+this.formData.field2.value+this.formData.field3.value+this.formData.field4.value+this.formData.field5.value+this.formData.field6.value)    
      this.authService.verifyOtpUser(fdata)
        .subscribe(
          data => {
            this.toastrMessageService.showSuccess('You have Successfully Verified Please login to continue.', "Success");
            //this.localStorageService.setItem(this.appCommon.LocalStorageKeyType.Otp,this.formData.field1.value+this.formData.field2.value+this.formData.field3.value+this.formData.field4.value+this.formData.field5.value+this.formData.field6.value)
            this.localStorageService.setItem(this.appCommon.LocalStorageKeyType.Otp, this.formData.otp.value.toString());
            this.router.navigate(['/auth/forget-password-reset']);
          },
          error => {
            this.error = error.message;
            this.toastrMessageService.showInfo('Invalid OTP', "Info");
            this.createOtpForm();
            this.isBtnLoading = false;
            this.submitted = false;
          });
    }
  }


  onKeyUpEvent(event: any) {
    if (event.target.value.length > 0) {

      if (event.target.id == "field1") {
        this.field2.nativeElement.focus();
      }
      else if (event.target.id == "field2") {
        this.field3.nativeElement.focus();
      }
      else if (event.target.id == "field3") {
        this.field4.nativeElement.focus();
      }
      else if (event.target.id == "field4") {
        this.field5.nativeElement.focus();
      }
      else if (event.target.id == "field5") {
        this.field6.nativeElement.focus();
      }
      else if (event.target.id == "field6") {
        this.field6.nativeElement.focus();
      }
      else {
        //do nothing        
      }
    }
  }

  onKeydown(event: any) {
    if (event.key == "Backspace") {
      if (event.target.value.length == 0) {
        if (event.target.id == "field6") {
          this.field5.nativeElement.focus();
        }
        else if (event.target.id == "field5") {
          this.field4.nativeElement.focus();
        }
        else if (event.target.id == "field4") {
          this.field3.nativeElement.focus();
        }
        else if (event.target.id == "field3") {
          this.field2.nativeElement.focus();
        }
        else if (event.target.id == "field2") {
          this.field1.nativeElement.focus();
        }
        else if (event.target.id == "field1") {
          this.field1.nativeElement.focus();
        }
        else {
          //do nothing        
        }
      }
    }

  }

  onBackClick() {
    this._location.back();
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/providers/services/user.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-user-topup',
  templateUrl: './user-topup.component.html',
  styleUrls: ['./user-topup.component.scss']
})
export class UserTopupComponent implements OnInit {

  topupForm: FormGroup;
  loading: boolean = false;
  showThankYou: boolean = false;
  walletBalance: any = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrMessageService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadWalletBalance();
  }

  createForm(): void {
    this.topupForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  loadWalletBalance(): void {
    this.userService.userWalletBalance({}).subscribe(
      (response) => {
        this.walletBalance = response;
      },
      (error) => {
        console.error('Failed to load wallet balance', error);
      }
    );
  }

  submitTopup(): void {
    if (this.topupForm.valid) {
      this.loading = true;
      const data = {
        amount: this.topupForm.value.amount
      };

      this.userService.TopUp(data).subscribe(
        (response) => {
          this.loading = false;
          this.showThankYou = true;
          this.topupForm.reset();
        },
        (error) => {
          this.loading = false;
          this.toastr.showError(error.error?.message || 'Failed to submit topup request', 'Error');
        }
      );
    }
  }

  closeThankYou(): void {
    this.showThankYou = false;
    this.loadWalletBalance();
  }

}

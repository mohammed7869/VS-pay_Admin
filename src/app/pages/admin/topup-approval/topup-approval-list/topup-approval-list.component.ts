import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/services/user.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-topup-approval-list',
  templateUrl: './topup-approval-list.component.html',
  styleUrls: ['./topup-approval-list.component.scss']
})
export class TopupApprovalListComponent implements OnInit {

  pendingTopUps: any[] = [];
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrMessageService
  ) { }

  ngOnInit(): void {
    this.loadPendingTopUps();
  }

  loadPendingTopUps(): void {
    this.loading = true;
    this.userService.getPendingTopUps().subscribe(
      (response) => {
        this.pendingTopUps = response;
        this.loading = false;
      },
      (error) => {
        this.toastr.showError('Failed to load pending topups', 'Error');
        this.loading = false;
      }
    );
  }

  approveTopUp(txnId: number): void {
    if (confirm('Are you sure you want to approve this topup?')) {
      this.loading = true;
      this.userService.approveTopUp({ txnId: txnId }).subscribe(
        (response) => {
          this.toastr.showSuccess('Topup approved successfully', 'Success');
          this.loadPendingTopUps();
        },
        (error) => {
          this.toastr.showError('Failed to approve topup', 'Error');
          this.loading = false;
        }
      );
    }
  }

  rejectTopUp(txnId: number): void {
    if (confirm('Are you sure you want to reject this topup?')) {
      this.loading = true;
      this.userService.rejectTopUp({ txnId: txnId }).subscribe(
        (response) => {
          this.toastr.showSuccess('Topup rejected successfully', 'Success');
          this.loadPendingTopUps();
        },
        (error) => {
          this.toastr.showError('Failed to reject topup', 'Error');
          this.loading = false;
        }
      );
    }
  }

}

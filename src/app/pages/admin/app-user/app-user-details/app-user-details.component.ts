import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/providers/services/common.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { UserService } from 'src/app/providers/services/user.service';

@Component({
  selector: 'app-app-user-details',
  templateUrl: './app-user-details.component.html',
  styleUrls: ['./app-user-details.component.scss']
})
export class AppUserDetailsComponent implements OnInit {
  lst: any = [];
  user: any = {};
  userId: any;
  constructor(
    private toastrMessageService: ToastrMessageService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private userService: UserService,
    private recordCreationService: RecordCreationService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.data['recordData']) {
      this.user = this.route.snapshot.data['recordData'];
    }
    if (this.route.snapshot.params.id)
      { this.userId = this.route.snapshot.params.id;
        this.search();
      }
  }

  search() {
    var fdata = { userId: this.userId };
    this.commonService
      .listtransaction(fdata)
      .subscribe(
        data => {
          // Sort transactions by transactionDate in descending order (most recent first)
          this.lst = data.sort((a: any, b: any) => {
            return new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
          });
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  getStatusText(status: number): string {
    switch(status) {
      case 1: return 'Completed';
      case 2: return 'Pending';
      case 3: return 'Under Processing';
      case 4: return 'Failed';
      default: return 'Unknown';
    }
  }

  getArrowIcon(isCr: boolean): string {
    if (isCr === false) {
      return '<i class="fas fa-arrow-up text-danger"></i> Paid';
    } else if (isCr === true) {
      return '<i class="fas fa-arrow-down text-success"></i> Received';
    }
    return '';
  }

  approveTopUp(txnId: number): void {
    if (confirm('Are you sure you want to approve this topup?')) {
      this.userService.approveTopUp({ txnId: txnId }).subscribe(
        (response) => {
          console.log(response);
          this.recordCreationService.announceUpdate({
            table: 'User',
            id: this.userId,
            fullName: this.user.fullName,
            phoneNumber: this.user.phoneNumber,
            roleId: this.user.roleId,
            email: this.user.email,
            password: this.user.password,
            confirmPassword: this.user.confirmPassword,        
            pendingTransactionCount: this.lst.filter((transaction: any) => transaction.status === 2).length - 1,
            hasPendingTransactions: this.lst.filter((transaction: any) => transaction.status === 2).length > 0
          });
          this.toastrMessageService.showSuccess('Topup approved successfully', 'Success');
          this.search(); // Refresh the transaction list
          this.loadUserDetails(); // Refresh user details including wallet balance
        },
        (error) => {
          this.toastrMessageService.showError('Failed to approve topup', 'Error');
        }
      );
    }
  }

  rejectTopUp(txnId: number): void {
    if (confirm('Are you sure you want to reject this topup?')) {
      this.userService.rejectTopUp({ txnId: txnId }).subscribe(
        (response) => {
          this.toastrMessageService.showSuccess('Topup rejected successfully', 'Success');
          this.search(); // Refresh the transaction list
        },
        (error) => {
          this.toastrMessageService.showError('Failed to reject topup', 'Error');
        }
      );
    }
  }

  loadUserDetails(): void {
    if (this.userId) {
      this.userService.getUserDetail({ userId: this.userId }).subscribe(
        (response) => {
          this.user = response;
        },
        (error) => {
          this.toastrMessageService.showError('Failed to load user details', 'Error');
        }
      );
    }
  }
}

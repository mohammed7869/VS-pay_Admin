import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { CommonService } from 'src/app/providers/services/common.service';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  recordData: any = {};
  recordList: any[] = [];
  departmentList: any = [];
  public appCommon = appCommon;
  userData: any = {};
  isDataLoaded: boolean = false;
  applicationPeriodList: any = [];
  totalUsers: number = 0;
  walletBalance: number = 0;
  unlockedBalance: number = 0;
  lockedBalance: number = 0;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private localStorageService: LocalStorageService) {
    this.createSearchForm();
    this.userData = this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo);
    this.get();
  }

  createSearchForm(): void {
    this.form = this.fb.group({
      applicationStatuses: [[1, 2, 3, 4, 5, 6, 7]],
      periodId: [null]
    });
  }

  ngOnInit(): void { }

  get() {
    const userId = this.getUserId();
    this.commonService
      .getUserDetail({ userId })
      .subscribe(
        data => {
          this.walletBalance = data.walletBalance || 0;
          this.unlockedBalance = data.unlocked || 0;
          this.lockedBalance = data.locked || 0;
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });

    this.commonService
      .getUserList({ searchText: '', roleId: null, pendingFilter: null })
      .subscribe(
        data => {
          this.totalUsers = Array.isArray(data) ? data.length : 0;
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  getFilters() {
    var obj: any = {
      applicationStatuses: this.form.value.applicationStatuses,
      periodId: this.form.value.periodId ? this.form.value.periodId : null,
    };
    return obj;
  }

  getApplicationList() {
    this.isDataLoaded = false;
    var fdata = this.getFilters();

    this.commonService
      .adminDashboardApplicationList(fdata)
      .subscribe(
        data => {
          this.recordList = data.data.list;
          this.isDataLoaded = true;
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  onEdit(e: any) {
    this.router.navigate(['applicant/application/edit/' + e.id]);
  }

  getCount(list, status): any {
    return list.filter(x => x.applicationStatus == status, true);
  }

  onPendingChlidClick() {
    this.localStorageService.setItem(this.appCommon.LocalStorageKeyType.DashBoardParameter, 'false');
    this.router.navigate(['admin/children-profiles']);
  }

  onNonItsUserClick() {
    this.localStorageService.setItem(this.appCommon.LocalStorageKeyType.DashBoardParameter, 'null');
    this.router.navigate(['admin/pending-profile']);
  }

  onPendingApplicationClick() {
    this.localStorageService.setItem(this.appCommon.LocalStorageKeyType.DashBoardParameter, 1);
    this.router.navigate(['admin/application']);
  }


  changePeriod(item) {
    item = item == 'null' ? null : item;
    this.form.patchValue({ periodId: item });
    this.getApplicationList();
  }

  private getUserId(): number {
    return this.userData?.userId || this.userData?.id || 11;
  }

  onTotalUsersClick() {
    this.router.navigate(['/admin/app-users']);
  }

  onWalletCardsClick() {
    const userId = this.getUserId();
    this.router.navigate(['/admin/app-users/superadmin', userId]);
  }
}

import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { appCommon } from 'src/app/common/_appCommon';
import { CommonService } from 'src/app/providers/services/common.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { UserService } from 'src/app/providers/services/user.service';

@Component({
  selector: 'app-super-admin-user-details-component',
  templateUrl: './super-admin-user-details-component.component.html',
  styleUrls: ['./super-admin-user-details-component.component.scss']
})
export class SuperAdminUserDetailsComponentComponent implements OnInit {
  lst: any = [];
  coinLoglst: any = [];
  user: any = {};
  userId: any;
  modalTitle: string = '';
  lockUnlockAmount: number;
  transferAmount: number;
  fromUnlockedToLocked: boolean;
  lockUnlockType: 'lock' | 'unlock' = 'lock';
  public appCommon = appCommon;
  selectedTab: number = 1;
  gridApi: any;
  columnDefs: ColDef[];
  gridApiCoin: any;
  columnDefsCoin: ColDef[];
  gridHeightWidth: any = {};
  constructor(
    private _service: UserService,
    private toastrMessageService: ToastrMessageService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.params.id) {
      this.userId = this.route.snapshot.params.id;
      this.getData();
    }
    this.setGridHeight();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {

    this.gridHeightWidth = {
      width: '100%',
      height: (window.innerHeight * (appCommon.GridHeightPer + 0.08)).toString() + 'px',
    };
  }

  getData() {
    this.get();
    this.search();
    this.searchCoinLog();
  }

  get() {
    var fdata = { userId: this.userId };
    this._service
      .getUserDetail(fdata)
      .subscribe(
        data => {
          this.user = data;
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  getArrowIcon(isCr: boolean): string {
    if (isCr === false) {
      return '<i class="fas fa-arrow-up text-danger"></i> Paid';
    } else if (isCr === true) {
      return '<i class="fas fa-arrow-down text-success"></i> Received';
    }
    return '';
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

  searchCoinLog() {
    var fdata = { userId: this.userId };
    this.commonService
      .getCoinTransferDetails(fdata)
      .subscribe(
        data => {
          // Sort coin log by transferDate in descending order (most recent first)
          this.coinLoglst = data.sort((a: any, b: any) => {
            return new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime();
          });
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  openLockUnlockModal(content: TemplateRef<any>, type: 'lock' | 'unlock') {
    this.lockUnlockType = type;
    this.modalTitle = type === 'lock' ? 'Add Lock Coins' : 'Add Unlock Coins';
    this.modalService.open(content, { centered: true });
  }

  submitLockUnlockForm() {
    const requestData = {
      unlocked: this.lockUnlockType === 'unlock' ? this.lockUnlockAmount : 0,
      locked: this.lockUnlockType === 'lock' ? this.lockUnlockAmount : 0
    };

    this.commonService.lockUnlockCoins(requestData).subscribe(
      response => {
        this.toastrMessageService.showSuccess("Coins updated successfully", "Success");
        this.modalService.dismissAll();
        this.getData();
      },
      error => {
        this.toastrMessageService.showError(error.error.message, "Error");
      }
    );
  }

  submittransferCoins() {
    const requestData = {
      amount: this.transferAmount,
      fromUnlockedToLocked: this.fromUnlockedToLocked
    };

    this._service.transferCoins(requestData).subscribe(
      response => {
        this.toastrMessageService.showSuccess("Coins transfered successfully", "Success");
        this.modalService.dismissAll();
        this.getData();
      },
      error => {
        this.toastrMessageService.showError(error.error.message, "Error");
      }
    );
  }

  onTabChanged(event: any) {
    this.selectedTab = event;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnDefs = [
      {
        field: 'transactionDate', headerName: 'Date', sortable: true, filter: true, wrapText: true, autoHeight: true, resizable: true, width: 150, sort: 'desc',
        valueFormatter: function (params) {
          return moment(params.value).format('DD/MM/YYYY ' + 'hh:mm A');
        },
      },
      { field: 'amount', headerName: 'Amount', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 80 },
      { 
        field: 'isCr', 
        headerName: 'Type', 
        sortable: true, 
        autoHeight: true, 
        filter: true, 
        resizable: true, 
        wrapText: true, 
        width: 150,
        cellRenderer: (params) => {
          return this.getArrowIcon(params.value);
        }
      },
      { field: 'description', headerName: 'Description', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150 },
      { field: 'recipientFullName', headerName: 'Recipient', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150 },
      { field: 'recipientMobileNo', headerName: 'Mobile', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150 },
      {
        field: 'txnType', headerName: 'Type', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150,
        valueFormatter: function (params) {
          return appCommon.EnTransactionTypeObjByte[params.value];
        },
      },
      {
        field: 'status', headerName: 'Status', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150,
        valueFormatter: function (params) {
          return appCommon.EnApplicationStatusForUserObj[params.value];
        },
      },
    ];
  }

  onCoinGridReady(params: any) {
    this.gridApiCoin = params.api;
    this.columnDefsCoin = [
      {
        field: 'transferDate', headerName: 'Date', sortable: true, filter: true, wrapText: true, autoHeight: true, resizable: true, width: 150, sort: 'desc',
        valueFormatter: function (params) {
          return moment(params.value).format('DD/MM/YYYY ' + 'hh:mm A');
        },
      },
      { field: 'amount', headerName: 'Amount', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 80 },
      { field: 'description', headerName: 'Description', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 250 },
      {
        field: 'transferType', headerName: 'Type', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 250,
        valueFormatter: function (params) {
          return appCommon.EnAdminCoinTransferTypeObjByte[params.value];
        },
      },
    ];
  }
}
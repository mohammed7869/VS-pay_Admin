import { Component, HostListener, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { appCommon } from 'src/app/common/_appCommon';
import { CommonService } from 'src/app/providers/services/common.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-app-user-all-trasaction',
  templateUrl: './app-user-all-trasaction.component.html',
  styleUrls: ['./app-user-all-trasaction.component.scss']
})
export class AppUserAllTrasactionComponent implements OnInit {
  gridApi: any;
  columnDefs: ColDef[];
  lst: any = [];
  gridHeightWidth: any = {};
  public appCommon = appCommon;

  constructor(
    private toastrMessageService: ToastrMessageService,
    private commonService: CommonService,
  ) {
    this.search();
  }

  ngOnInit(): void {
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

  search() {
    this.commonService
      .listtransaction({})
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

  getArrowIcon(isCr: boolean): string {
    if (isCr === true) {
      return '<i class="fas fa-arrow-up text-danger"></i> Paid';
    } else if (isCr === false) {
      return '<i class="fas fa-arrow-down text-success"></i> Received';
    }
    return '';
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
      { 
        field: 'description', 
        headerName: 'Description', 
        sortable: true, 
        autoHeight: true, 
        filter: true, 
        resizable: true, 
        wrapText: true, 
        width: 150
      },
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
}

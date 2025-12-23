import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ColDef } from "ag-grid-community";
import * as moment from "moment";
import { formatDate } from "@angular/common";
import { appCommon } from "src/app/common/_appCommon";
import { CommonService } from "src/app/providers/services/common.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { xlsxCommon } from "src/app/common/xlsx_common";

@Component({
  selector: "app-transaction-history",
  templateUrl: "./transaction-history.component.html",
  styleUrls: ["./transaction-history.component.scss"],
})
export class TransactionHistoryComponent implements OnInit {
  gridApi: any;
  columnDefs: ColDef[];
  lst: any = [];
  filteredLst: any = [];
  gridHeightWidth: any = {};
  public appCommon = appCommon;
  form: FormGroup;
  showFilters: boolean = false;
  isBtnLoading: boolean = false;
  submitted: boolean = false;
  userId: any;

  constructor(
    private toastrMessageService: ToastrMessageService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.createSearchForm();
  }

  ngOnInit(): void {
    // Extract userId from route parameter if available
    if (this.route.snapshot.params.userId) {
      this.userId = this.route.snapshot.params.userId;
      // Set userId in form and disable it since it comes from route
      this.form.patchValue({ userId: this.userId });
      this.form.get('userId')?.disable();
    } else {
      // Default to userId 11 when opened directly
      this.userId = this.form.getRawValue().userId || 11;
      this.form.patchValue({ userId: this.userId });
    }
    this.setGridHeight();
    this.search();
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {
    this.gridHeightWidth = {
      width: "100%",
      height:
        (window.innerHeight * (appCommon.GridHeightPer + 0.08)).toString() +
        "px",
    };
  }

  createSearchForm(): void {
    this.form = this.fb.group({
      fromDate: [null],
      toDate: [null],
      userId: [{value: 11, disabled: false}],
    });
  }

  search() {
    this.isBtnLoading = true;
    const payload: any = {};
    
    // Use userId from route parameter if available, otherwise use form value
    // Use getRawValue() to get disabled field values
    const userIdToUse = this.userId || this.form.getRawValue().userId;
    if (userIdToUse) {
      payload.userId = userIdToUse;
    }

    this.commonService.listtransaction(payload).subscribe(
      (data) => {
        this.isBtnLoading = false;
        // Sort transactions by transactionDate in descending order (most recent first)
        this.lst = data.sort((a: any, b: any) => {
          return (
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime()
          );
        });
        this.applyDateFilter();
      },
      (error) => {
        this.isBtnLoading = false;
        this.toastrMessageService.showInfo(error.error?.message || "Error loading transactions", "Info");
        this.lst = [];
        this.filteredLst = [];
      }
    );
  }

  applyDateFilter() {
    const fromDate = this.form.value.fromDate;
    const toDate = this.form.value.toDate;

    if (!fromDate && !toDate) {
      this.filteredLst = this.lst;
      return;
    }

    this.filteredLst = this.lst.filter((transaction: any) => {
      const transactionDate = new Date(transaction.transactionDate);
      
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        return transactionDate >= from && transactionDate <= to;
      } else if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        return transactionDate >= from;
      } else if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        return transactionDate <= to;
      }
      
      return true;
    });
  }

  submitSearch() {
    this.submitted = true;
    this.applyDateFilter();
    if (this.filteredLst.length === 0 && (this.form.value.fromDate || this.form.value.toDate)) {
      this.toastrMessageService.showInfo("No transactions found for the selected date range", "Info");
    }
  }

  clear() {
    this.submitted = false;
    this.form.patchValue({
      fromDate: null,
      toDate: null,
      userId: null,
    });
    this.filteredLst = this.lst;
  }

  submitItemExportToExcel(type: number) {
    const dataToExport = this.filteredLst && this.filteredLst.length > 0 ? this.filteredLst : this.lst;
    
    if (!dataToExport || dataToExport.length === 0) {
      this.toastrMessageService.showWarning(
        "No data available to export",
        "Warning"
      );
      return;
    }

    try {
      // Prepare headers
      const headers = [
        "ID",
        "Transaction Date",
        // "User ID",
        "Amount",
        "Type",
        "Description",
        "Recipient",
        "Transaction Type",
        "Status",
        // "Payment Status",
        // "Unlocked",
      ];

      // Transform transaction data to array of arrays
      const data = dataToExport.map((transaction: any) => {
        // Format transaction date
        const transactionDate = transaction.transactionDate
          ? moment(transaction.transactionDate).format("DD/MM/YYYY hh:mm A")
          : "";

        // Format type (isCr)
        const type = transaction.isCr === true ? "Paid" : transaction.isCr === false ? "Received" : "";

        // Format recipient
        const recipientFullName = transaction.recipientFullName || "";
        const recipientMobileNo = transaction.recipientMobileNo || "";
        const recipient = recipientMobileNo
          ? `${recipientFullName} (${recipientMobileNo})`
          : `${recipientFullName} (Self)`;

        // Format transaction type
        const txnType = transaction.txnType
          ? appCommon.EnTransactionTypeObjByte[transaction.txnType] || ""
          : "";

        // Format status
        const status = transaction.status
          ? appCommon.EnApplicationStatusForUserObj[transaction.status] || ""
          : "";

        return [
          transaction.id || "",
          transactionDate,
          // transaction.userId || "",
          transaction.amount || "",
          type,
          transaction.description || "",
          recipient,
          txnType,
          status,
          // transaction.paymentStatus || "",
          // transaction.unlocked || "",
        ];
      });

      // Add headers as first row
      data.unshift(headers);

      // Generate filename with current date
      const currentDate = moment().format("YYYY-MM-DD");
      const filename = `Transaction_History_${currentDate}.xlsx`;

      // Prepare export options
      const exportOptions = {
        data: data,
        sheetName: "Transaction History",
        filename: filename,
      };

      // Export to Excel
      xlsxCommon.data2xlsx(exportOptions);

      this.toastrMessageService.showSuccess(
        "Transaction data exported successfully",
        "Success"
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      this.toastrMessageService.showError(
        "Error exporting transaction data",
        "Error"
      );
    }
  }

  getArrowIcon(isCr: boolean): string {
    if (isCr === false) {
      return '<i class="fas fa-arrow-up text-danger"></i> Paid';
    } else if (isCr === true) {
      return '<i class="fas fa-arrow-down text-success"></i> Received';
    }
    return "";
  }

  getRecipientDisplay(params: any): string {
    const recipientFullName = params.data.recipientFullName;
    const recipientMobileNo = params.data.recipientMobileNo;
    if (!recipientMobileNo || recipientMobileNo === null) {
      return `${recipientFullName} (Self)`;
    }
    return `${recipientFullName} (${recipientMobileNo})`;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnDefs = [
      {
        field: "id",
        headerName: "ID",
        sortable: true,
        filter: true,
        resizable: true,
        width: 50,
      },
      {
        field: "transactionDate",
        headerName: "Date",
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        resizable: true,
        width: 150,
        sort: "desc",
        valueFormatter: function (params) {
          return moment(params.value).format("DD/MM/YYYY " + "hh:mm A");
        },
      },
      // {
      //   field: "userId",
      //   headerName: "User ID",
      //   sortable: true,
      //   filter: true,
      //   resizable: true,
      //   width: 80,
      // },
      {
        field: "amount",
        headerName: "Amount",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 80,
      },
      {
        field: "isCr",
        headerName: "Type",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 150,
        cellRenderer: (params) => {
          return this.getArrowIcon(params.value);
        },
      },
      {
        field: "description",
        headerName: "Description",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 150,
      },
      {
        field: "recipientFullName",
        headerName: "Recipient",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 200,
        cellRenderer: (params) => {
          return this.getRecipientDisplay(params);
        },
      },
      {
        field: "txnType",
        headerName: "Transaction Type",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 150,
        valueFormatter: function (params) {
          return appCommon.EnTransactionTypeObjByte[params.value];
        },
      },
      {
        field: "status",
        headerName: "Status",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 150,
        valueFormatter: function (params) {
          return appCommon.EnApplicationStatusForUserObj[params.value];
        },
      },
      {
        field: "paymentStatus",
        headerName: "Payment Status",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 150,
      },
      {
        field: "approvalRefNo",
        headerName: "Approval Ref No",
        sortable: true,
        autoHeight: true,
        filter: true,
        resizable: true,
        wrapText: true,
        width: 150,
      },
    ];
  }
}



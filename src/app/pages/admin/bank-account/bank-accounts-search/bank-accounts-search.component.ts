import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef } from 'ag-grid-community';
import { appCommon } from 'src/app/common/_appCommon';
import { BankDetailsService } from 'src/app/providers/services/bank-details.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgViewButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-view-button-renderer/ag-view-button-renderer.component';
import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-bank-accounts-search',
  templateUrl: './bank-accounts-search.component.html',
  styleUrls: ['./bank-accounts-search.component.scss']
})
export class BankAccountsSearchComponent implements OnInit {

  form: FormGroup;
  columnDefs: ColDef[];
  lst: any = [];
  totalRecs: number = 0
  gridApi: any;

  isBtnLoading: boolean = false;
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  @ViewChild('content') content: ElementRef;
  isAppBtnLoading: boolean = false;

  public appCommon = appCommon;
  isChildRouteActive: boolean = false;
  breadcrumbTitle: String = 'List';
  pageTitle: String = 'Bank Account';
  gridHeightWidth: any = {};
  singleRecordData: any = {};
  @ViewChild('printable') printable: ElementRef;
  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private bankDetailsService: BankDetailsService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.setGridHeight();
    this.createSearchForm();
    this.search();
  }

  ngAfterViewInit() {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.setGridHeight();
  }

  setGridHeight() {
    this.gridHeightWidth = {
      width: '100%',
      height: (window.innerHeight * appCommon.GridHeightPer).toString() + 'px',
    };
  }

  clear() {
    this.submitted = false;
    this.createSearchForm();
    this.search();
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(['admin/bank-account']);
    } else {

    }
  }

  ngOnDestroy(): void {
  }

  submitSearch() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      if (this.form.value.resultType == 1) {
        this.search();
      } else if (this.form.value.resultType == 2 || this.form.value.resultType == 3) {
        this.submitItemExportToExcel(this.form.value.resultType);
      } else if (this.form.value.resultType == 4) {
        this.generatePdf();
      } else if (this.form.value.resultType == 5) {
        this.generatePdf();
      }
    }
  }

  submitItemExportToExcel(type: number) {
    this.isBtnLoading = true;
    var fdata = this.getFilters();

    this.bankDetailsService.export(fdata)
      .subscribe(data => {
        if (data.size) {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(data);
          a.href = objectUrl;
          a.setAttribute("download", type == 2 ? 'applicationMasters.csv' : 'applicationMasters.xlsx');
          a.click();
          URL.revokeObjectURL(objectUrl);
        }
        else { this.toastrMessageService.showInfo('No data found to export.', 'Info'); }
        this.isBtnLoading = false;
      },
        async error => {
          this.isBtnLoading = false;
          const temp = await (new Response(error)).json();
          this.toastrMessageService.showInfo(temp.message, 'Info');
        });
  }

  generatePdf() {
    const content = this.printable.nativeElement;
    const options = {
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
      margin: [30, 20, 40, 20],
      onBeforeStart: () => {
        this.isBtnLoading = true;
      },
      onAfterPdfGeneration: () => {
        this.isBtnLoading = false;
      },
      style: {
        color: '#000000' // Black color
      }
    };

    const pdf = html2pdf().from(content).set(options).output('blob');

    pdf.then((blob) => {
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      printWindow.onload = () => {
        printWindow.print();
      };
    });
  }

  search() {
    var fdata = this.getFilters();
    this.isBtnLoading = true;
    this.bankDetailsService.adminList(fdata)
      .subscribe(
        data => {
          this.isBtnLoading = false;
          this.lst = data.data.list;
          this.totalRecs = data.totalCount;
        },
        error => {
          this.isBtnLoading = false;
          this.toastrMessageService.showInfo(error.error.message, "Info");
          this.lst = [];
          this.gridApi.setRowData(this.lst);
        });
  }


  onGridReady(params: any) {
    this.gridApi = params.api;

    this.columnDefs = [
      // {
      //   field: 'id', headerName: '', width: 25,
      //   cellRenderer: "agViewButtonRendererComponent",
      //   cellRendererParams: {
      //     onClick: this.onEdit.bind(this)
      //   },
      // },
      // {
      //   field: 'name', headerName: '', width: 25,
      //   cellRenderer: "deleteButtonRendererComponent",
      //   cellRendererParams: {
      //     onClick: this.onDelete.bind(this)
      //   },
      // },
      { field: 'account.name', headerName: 'Applicant Name', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      { field: 'accountName', headerName: 'Account Name', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      { field: 'accountNo', headerName: 'Account No', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      { field: 'confirmAccountNo', headerName: 'Confirm Account', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      { field: 'ifscCode', headerName: 'IFSC Code', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      { field: 'branchName', headerName: 'Branch Name', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      { field: 'bankName', headerName: 'Bank Name', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      // {
      //   field: 'isApproved', headerName: 'Status', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150,
      //   valueFormatter: function (params) {
      //     return params.value ? 'Approved' : 'Pending';
      //   },
      // },
    ];
  }

  frameworkComponents = {
    agViewButtonRendererComponent: AgViewButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent
  };

  getFilters() {
    var obj: any = {
      searchText: "",
      type: null
    };

    if (this.form.value.searchText) {
      obj.searchText = this.form.value.searchText;
    }
    if (this.form.value.type && this.form.value.type != "null") {
      obj.type = this.form.value.type;
    }

    return obj;
  }


  createSearchForm(): void {
    this.form = this.fb.group({
      searchText: [""],
      resultType: [1, [Validators.required]],
    });

  }

  onEdit(e: any) {
    //this.router.navigate(['admin/bank-account/edit/' + e.rowData.id]);
    this.singleRecordData = e.rowData
    this.modalService.open(this.content);
  }

  onDelete(e: any) {
    if (confirm("Are you sure want to delete record ?")) {
      this.bankDetailsService.delete(e.rowData.id)
        .subscribe(
          data => {
            this.toastrMessageService.showSuccess("Record deleted successfully.", "Success");
            this.lst.splice(e.rowData.index, 1);
            this.gridApi.updateRowData({ remove: [e.rowData] });
          },
          error => {
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }

  onApproveClick(): void {
    this.isAppBtnLoading = true;
    this.bankDetailsService.approveBankDetails(this.singleRecordData.id)
      .subscribe(
        data => {
          this.isAppBtnLoading = false;
          if (this.singleRecordData.isApproved) this.toastrMessageService.showInfo("Bank details un-approved successfully.", "Success");
          else this.toastrMessageService.showSuccess("Bank details approved successfully.", "Success");
          this.lst.filter((row: any) => { if (row.id == this.singleRecordData.id) { var newRow = row; newRow.isApproved = !newRow.isApproved; return newRow; } })[0];
          this.gridApi.setRowData(this.lst);
          this.modalService.dismissAll();
        },
        error => {
          this.isAppBtnLoading = false;
          this.toastrMessageService.showInfo(error.error.message, "Info");
        }
      )
  }
}

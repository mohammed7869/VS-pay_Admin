import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { IfscCodeService } from 'src/app/providers/services/ifsc-code.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import html2pdf from 'html2pdf.js';
import { xlsxCommon } from 'src/app/common/xlsx_common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ifsc-code-search',
  templateUrl: './ifsc-code-search.component.html',
  styleUrls: ['./ifsc-code-search.component.scss']
})
export class IfscCodeSearchComponent implements OnInit {
  form: FormGroup;
  columnDefs: ColDef[];
  lst: any = [];
  totalRecs: number = 0
  gridApi: any;

  isBtnLoading: boolean = false;
  isOnItEvent: boolean = false;
  submitted: boolean = false;

  public appCommon = appCommon;
  isChildRouteActive: boolean = false;
  insertSubscription: Subscription;
  updateSubscription: Subscription;
  breadcrumbTitle: String = 'List';
  pageTitle: String = 'IFSC';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;

  selectedFiles: any;
  uploadForm: FormGroup;
  isUploadDocSubmitted: boolean = false;
  arrayBuffer: any;
  isUploadDocBtnLoading: boolean = false;
  uploadMessage: string = ''

  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private ifscCodeService: IfscCodeService,
    private recordCreationService: RecordCreationService,
    private modalService: NgbModal) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('admin/ifsc-code/new') !== -1 || event.url.indexOf('admin/ifsc-code/edit') !== -1;
        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'IFSC';
        }
        else {
          if (event.url.indexOf('admin/ifsc-code/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New IFSC';
          }
          else if (event.url.indexOf('admin/ifsc-code/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'IFSC Info';
          }
          else {

          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'IFSC') {
          var newRowData = {
            id: record.id,
            bankName: record.bankName,
            code: record.code,
            branch: record.branch,
            city1: record.city1,
            address: record.address,
            city2: record.city2,
            state: record.state,
            stdCode: record.stdCode,
            phone: record.phone,
            city1Text: record.city1Text,
            city2Text: record.city2Text,
            stateText: record.stateText,
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['admin/ifsc-code']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'IFSC') {

          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;

              //change here only             
              newRow.bankName = record.bankName;
              newRow.code = record.code;
              newRow.branch = record.branch;
              newRow.city1 = record.city1;
              newRow.address = record.address;
              newRow.city2 = record.city2;
              newRow.state = record.state;
              newRow.stdCode = record.stdCode;
              newRow.phone = record.phone;
              newRow.city1Text = record.city1Text;
              newRow.city2Text = record.city2Text;
              newRow.stateText = record.stateText;
              //********************** */


              return newRow;
            }
          });

          this.gridApi.updateRowData({ update: [newRowData] });
          this.router.navigate(['admin/ifsc-code']);
        }
      });
  }

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

  ngOnDestroy(): void {
    this.insertSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
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
    this.submitSearch();
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(['admin/ifsc-code']);
    } else {

    }
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

    this.ifscCodeService.export(fdata)
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
    this.ifscCodeService
      .list(fdata)
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
      {
        field: 'bankName', headerName: '', width: 25,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this)
        },
      },
      {
        field: 'bankName', headerName: '', width: 25,
        cellRenderer: "deleteButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onDelete.bind(this)
        },
      },
      { field: 'bankName', headerName: 'Bank Name', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 150, },
      { field: 'code', headerName: 'Code', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 200, },
      { field: 'branch', headerName: 'Branch', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },
      { field: 'address', headerName: 'Address', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },
      { field: 'city1Text', headerName: 'City1', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },
      { field: 'city2Text', headerName: 'City2', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },
      { field: 'stateText', headerName: 'State', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },
      { field: 'stdCode', headerName: 'Std Code', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },
      { field: 'phone', headerName: 'Phone', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },

    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent
  };

  getFilters() {
    var obj: any = {
      searchText: "",
    };

    if (this.form.value.searchText) {
      obj.searchText = this.form.value.searchText;
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
    this.router.navigate(['admin/ifsc-code/edit/' + e.rowData.id]);
  }

  onDelete(e: any) {
    if (confirm("Are you sure want to delete record ?")) {
      this.ifscCodeService.delete(e.rowData.id)
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

  onCreate() {
    this.router.navigate(['admin/ifsc-code/new']);
  }

  onBack() {
    this.router.navigate(['admin/ifsc-code']);
  }

  openFileUploadModal(content) {
    this.isUploadDocSubmitted = false;
    this.uploadMessage = '';
    this.selectedFiles = [];
    this.createUploadForm();
    this.modalService.open(content, { centered: true });
  }

  createUploadForm() {
    this.uploadForm = this.fb.group({
      files: ['', Validators.required],
    });
  }

  onFileChange(event) {
    this.uploadMessage = '';
    this.selectedFiles.push(event.target.files[0]);
  }

  uploadDetails() {
    this.isUploadDocSubmitted = true;

    if (this.uploadForm.invalid) {
      console.log(this.uploadForm.errors);
      return;
    }
    else {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.selectedFiles[0]);
      fileReader.onload = (e) => {

        this.isUploadDocBtnLoading = true;

        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log(arraylist)

        var fdata = [];

        var allDataNotAdded = false;

        arraylist.forEach((v: any) => {
          if (v["Bank Name"] && v["Code"] && v["Branch"] && v["State"] && v["City 1"]) {
            fdata.push({
              bankName: v["Bank Name"].toString(),
              code: v["Code"].toString(),
              branch: v["Branch"].toString(),
              state: v["State"].toString(),
              city1: v["City 1"].toString(),
              city2: v["City 2"] ? v["City 2"].toString() : '',
              stdCode: v["Std Code"] ? v["Std Code"].toString() : '',
              phone: v["Phone"] ? v["Phone"].toString() : '',
              address: v["Address"] ? v["Address"].toString() : ''
            });
          } else {
            allDataNotAdded = true;
          }
        });

        if (allDataNotAdded) {
          alert('Data missing, please add all required data before uploading.');
          this.isUploadDocBtnLoading = false;
          return;
        }

        if (!fdata.length) {
          alert('Please select data to upload');
          this.isUploadDocBtnLoading = false;
          return;
        }
        this.ifscCodeService.upload(fdata)
          .subscribe(
            data => {
              this.uploadMessage = data.data.toString();
              this.clearUploadForm();
              this.isUploadDocBtnLoading = false;
              this.search();
              this.toastrMessageService.showSuccess(data.data + ' records uploaded successfully.', "Info");
            },
            error => {
              this.isUploadDocBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
    }
  }

  clearUploadForm() {
    this.createUploadForm();
    this.isUploadDocSubmitted = false;
    this.selectedFiles = [];
    this.arrayBuffer = null;
  }

  downloadExcel() {

    this.toastrMessageService.showSuccess("Export started please wait.", "Success");

    var toexport = [{
      "Bank Name": '',
      "Code": '',
      "Branch": '',
      "State": '',
      "City 1": '',
      "City 2": '',
      "Std Code": '',
      "Phone": '',
      "Address": '',
    }];

    xlsxCommon.data2xlsx({
      filename: "Upload Template" + ".xlsx",
      sheetName: "Sheet1",
      data: toexport
    });
  }

  onSelect() {
    this.uploadMessage = '';
  }
}

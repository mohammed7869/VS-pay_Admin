import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { MasterValueService } from 'src/app/providers/services/master-value.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import html2pdf from 'html2pdf.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { xlsxCommon } from 'src/app/common/xlsx_common';
import { AgRestoreButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-restore-button-renderer/ag-restore-button-renderer.component';
import * as moment from 'moment';
@Component({
  selector: 'app-master-value-search',
  templateUrl: './master-value-search.component.html',
  styleUrls: ['./master-value-search.component.scss']
})
export class MasterValueSearchComponent implements OnInit {
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
  pageTitle: String = 'Application Master';
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
    private masterValueService: MasterValueService,
    private modalService: NgbModal,
    private recordCreationService: RecordCreationService) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('admin/master-value/new') !== -1 || event.url.indexOf('admin/master-value/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Application Master';
        }
        else {
          if (event.url.indexOf('admin/master-value/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Application Master';
          }
          else if (event.url.indexOf('admin/master-value/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Application Master Info';
          }
          else {

          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'Master Value') {
          var newRowData = {
            id: record.id,
            text: record.text,
            description: record.description,
            type: record.type,
            isPublished: record.isPublished,
            accountId: record.accountId,
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['admin/master-value']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'Master Value') {

          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;

              //change here only             
              newRow.description = record.description;
              newRow.type = record.type;
              newRow.isPublished = record.isPublished;
              newRow.text = record.text;
              newRow.accountId = record.accountId;
              //********************** */

              return newRow;
            }
          })[0];

          this.gridApi.setRowData(this.lst);
          this.router.navigate(['admin/master-value']);
        }
      });
  }

  ngOnInit(): void {

    this.setGridHeight();
    this.createSearchForm();

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
    this.lst = [];
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(['admin/master-value']);
    } else {

    }
  }

  ngOnDestroy(): void {
    this.insertSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
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

    this.masterValueService.export(fdata)
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
    this.gridApi.showLoadingOverlay();
    this.isBtnLoading = true;
    this.masterValueService.list(fdata)
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
        field: 'text', headerName: '', width: 25,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this)
        },
      },
      {
        field: 'text', headerName: '', width: 25,
        cellRenderer: "restoreButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onRestoreMasterValue.bind(this)
        },
        cellStyle: (params) => {
          return params.data.bDeleted ? null : { display: 'none' };
        }
      },
      {
        field: 'text', headerName: '', width: 25,
        cellRenderer: "deleteButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onDelete.bind(this)
        },
        cellStyle: (params) => {
          return !params.data.bDeleted ? null : { display: 'none' };
        }
      },
      {
        field: 'text', headerName: 'Text', tooltipField: "text", sortable: true, filter: true, resizable: true, minWidth: 250, maxWidth: 600,
        cellRenderer: function (params) {
          if (!params.data.accountId) {
            return params.value;
          }
          else {
            return params.value + `<span class="text-warning"> (Requested by ${params.data.userITSId})</span>`;
          }
        },
      },
      {
        field: 'type', headerName: 'Type', sortable: true, width: 150,
        cellRenderer: (data) => {
          return appCommon.MastervaluetypeObj[data.value]
        }
      },
      {
        field: 'isPublished',
        headerName: 'Published',
        sortable: true,
        filter: true,
        minWidth: 50,
        maxWidth: 100,
        valueGetter: function (params) {
          return params.data.isPublished ? 'Yes' : 'No';
        },
        valueSetter: function (params) {
          params.data.isPublished = params.newValue === 'Yes';
          return true;
        },
        filterParams: {
          valueFormatter: function (params) {
            return params.value === 'Yes' ? true : false;
          },
        },
      },
      { field: 'description', headerName: 'Description', tooltipField: "description", sortable: true, filter: true, resizable: true, minWidth: 250, maxWidth: 600 },
      {
        field: 'createdDate', headerName: 'Created Date', sortable: true, filter: true, wrapText: true, autoHeight: true, resizable: true, width: 150,
        valueFormatter: function (params) {
          return moment(params.value).format('DD/MM/YYYY' + ' hh:mm A');
        },
      },
    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent,
    restoreButtonRendererComponent: AgRestoreButtonRendererComponent
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
      type: ["", [Validators.required]],
      resultType: [1, [Validators.required]],
    });

  }

  onEdit(e: any) {
    this.router.navigate(['admin/master-value/edit/' + e.rowData.id]);
  }

  onDelete(e: any) {
    if (confirm("Are you sure want to delete record ?")) {
      this.masterValueService.delete(e.rowData.id)
        .subscribe(
          data => {
            //debugger
            if (!data.data.bDeleted) {
              this.toastrMessageService.showSuccess("Record deleted successfully.", "Success");
              this.lst.splice(e.rowData.index, 1);
              this.gridApi.updateRowData({ remove: [e.rowData] });
            } else {
              let newRowData = this.lst.filter((row: any) => {
                if (row.id == data.data.id) {
                  var newRow = row;
                  newRow.bDeleted = data.data.bDeleted;
                  return newRow;
                }
              })[0];
              this.gridApi.setRowData(this.lst);
              this.toastrMessageService.showSuccess("Record marked as in active.", "Success");
            }
          },
          error => {
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }

  onRestoreMasterValue(e: any) {
    if (confirm("Are you sure want to restore record ?")) {
      this.masterValueService.restoreMasterValue(e.rowData.id)
        .subscribe(
          data => {
            this.toastrMessageService.showSuccess("Record restored successfully.", "Success");
            let newRowData = this.lst.filter((row: any) => {
              if (row.id == data.data.id) {
                var newRow = row;
                newRow.bDeleted = data.data.bDeleted;
                return newRow;
              }
            })[0];
            this.gridApi.setRowData(this.lst);
          },
          error => {
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }

  onCreate() {
    this.router.navigate(['admin/master-value/new']);
  }

  onBack() {
    this.router.navigate(['admin/master-value']);
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
      type: [null, Validators.required]
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
          if (v["Text"]) {
            fdata.push({
              text: v["Text"].toString(),
              description: v["Description"] ? v["Description"].toString() : '',
              type: this.uploadForm.value.type
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
        this.masterValueService.upload(fdata)
          .subscribe(
            data => {
              this.uploadMessage = data.data.toString();
              this.clearUploadForm();
              this.isUploadDocBtnLoading = false;
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
      "Text": '',
      "Description": '',
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




























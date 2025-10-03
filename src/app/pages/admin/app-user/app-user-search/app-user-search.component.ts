import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { UserService } from 'src/app/providers/services/user.service';
import html2pdf from 'html2pdf.js';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
@Component({
  selector: 'app-app-user-search',
  templateUrl: './app-user-search.component.html',
  styleUrls: ['./app-user-search.component.scss']
})
export class AppUserSearchComponent implements OnInit {

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
  pageTitle: String = 'App Users';
  gridHeightWidth: any = {};
  @ViewChild('printable') printable: ElementRef;
  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private userService: UserService,
    private recordCreationService: RecordCreationService) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isChildRouteActive = event.url.indexOf('admin/app-users/new') !== -1 || event.url.indexOf('admin/app-users/edit') !== -1 || event.url.indexOf('admin/app-users/superadmin') !== -1;
        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'App Users';
        }
        else {
          if (event.url.indexOf('admin/app-users/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New App Users';
          }
          else if (event.url.indexOf('admin/app-users/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'App Users Info';
          } else if (event.url.indexOf('admin/app-users/superadmin') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Super Admin Info';
          }
          else {

          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'User') {
          var newRowData = {
            id: record.id,
            fullName: record.fullName,
            phoneNumber: record.phoneNumber,
            roleId: record.roleId,
            email: record.email,
            password: record.password,
            confirmPassword: record.confirmPassword           
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['admin/app-users']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'User') {

          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;

              //change here only             
              newRow.fullName = record.fullName;
              newRow.phoneNumber = record.phoneNumber;
              newRow.roleId = record.roleId;
              newRow.email = record.email;
              newRow.password = record.password;
              newRow.confirmPassword = record.confirmPassword;
              newRow.pendingTransactionCount = record.pendingTransactionCount;
              newRow.hasPendingTransactions = record.hasPendingTransactions;

              //********************** */
              return newRow;
            }
          });

          this.gridApi.updateRowData({ update: [newRowData] });
          //this.router.navigate(['admin/app-users']);
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
      this.router.navigate(['admin/app-users']);
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

    this.userService.export(fdata)
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
    this.userService
      .list(fdata)
      .subscribe(
        data => {
          this.isBtnLoading = false;
          this.lst = data;
          this.totalRecs = data.length;
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
        field: 'fullName', headerName: '', width: 25,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this)
        },
      },
      // {
      //   field: 'fullName', headerName: '', width: 25,
      //   cellRenderer: "deleteButtonRendererComponent",
      //   cellRendererParams: {
      //     onClick: this.onDelete.bind(this)
      //   },
      // },
      { field: 'name', headerName: 'Name', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 200, },
      // {
      //   field: 'roleId', headerName: 'Role', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 200,
      //   cellRenderer: (data) => {
      //     return appCommon.EnRoleObj[data.value]
      //   }
      // },
      { field: 'mobile', headerName: 'Mobile Number', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150, },
      { field: 'email', headerName: 'Email', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 200, },
      { 
        field: 'pendingTransactionCount', 
        headerName: 'Pending Transactions', 
        sortable: true, 
        filter: true, 
        autoHeight: true, 
        resizable: true, 
        wrapText: true, 
        width: 150,
        cellRenderer: (data: any) => {
          if (data.value > 0) {
            return `<span class="badge badge-warning">${data.value}</span>`;
          }
          return '<span class="badge badge-success">0</span>';
        }
      },
      { 
        field: 'hasPendingTransactions', 
        headerName: 'Has Pending', 
        sortable: true, 
        filter: true, 
        autoHeight: true, 
        resizable: true, 
        wrapText: true, 
        width: 120,
        cellRenderer: (data: any) => {
          if (data.value) {
            return '<span class="badge badge-danger">Yes</span>';
          }
          return '<span class="badge badge-success">No</span>';
        }
      },
    ];
  }

  frameworkComponents = {
    editButtonRendererComponent: AgEditButtonRendererComponent,
    deleteButtonRendererComponent: AgDeleteButtonRendererComponent
  };

  getFilters() {
    var obj: any = {
      searchText: "",
      roleId: null,
      pendingFilter: null
    };

    if (this.form.value.searchText) {
      obj.searchText = this.form.value.searchText;
    }

    if (this.form.value.roleId) {
      obj.roleId = this.form.value.roleId;
    }

    if (this.form.value.pendingFilter) {
      obj.pendingFilter = this.form.value.pendingFilter === 'true';
    }

    return obj;
  }

  createSearchForm(): void {
    this.form = this.fb.group({
      searchText: [""],
      resultType: [1, [Validators.required]],
      roleId: [null],
      pendingFilter: [""],
    });
  }

  onEdit(e: any) {
    this.router.navigate(['admin/app-users/edit/' + e.rowData.id]);
  }

  onDelete(e: any) {
    if (confirm("Are you sure want to delete record ?")) {
      this.userService.delete(e.rowData.id)
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
    this.router.navigate(['admin/app-users/new']);
  }

  onBack() {
    this.router.navigate(['admin/app-users']);
  }

}
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { appCommon } from 'src/app/common/_appCommon';
import { CoinMasterService } from 'src/app/providers/services/coin-master.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgDeleteButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-delete-button-renderer/ag-delete-button-renderer.component';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';

@Component({
  selector: 'app-coin-master-search',
  templateUrl: './coin-master-search.component.html',
  styleUrls: ['./coin-master-search.component.scss']
})
export class CoinMasterSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  form: FormGroup;
  columnDefs: ColDef[];
  lst: any = [];
  totalRecs: number = 0
  gridApi: any;
  isBtnLoading: boolean = false;
  stockPlaceList: any = [];
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  public appCommon = appCommon;
  isChildRouteActive: boolean = false;
  insertSubscription: Subscription;
  updateSubscription: Subscription;
  breadcrumbTitle: String = 'List';
  pageTitle: String = 'Token Master Listings';

  isCollapsed = true;
  gridHeightWidth: any = {};

  constructor(
    private router: Router,
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private service: CoinMasterService,
    recordCreationService: RecordCreationService) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        //console.log('val -', event);
        this.isChildRouteActive = event.url.indexOf('admin/coin-master/new') !== -1 || event.url.indexOf('admin/coin-master/edit') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Token Master Listings';
        }
        else {
          if (event.url.indexOf('admin/coin-master/new') !== -1) {
            this.breadcrumbTitle = 'New';
            this.pageTitle = 'Create New Token Master';
          }
          else if (event.url.indexOf('admin/coin-master/edit') !== -1) {
            this.breadcrumbTitle = 'Edit';
            this.pageTitle = 'Token Master Info';
          }
          else {

          }
        }
      });

    this.insertSubscription = recordCreationService.recordInserted$.subscribe(
      record => {
        if (record.table == 'C-M') {
          var newRowData = {
            id: record.id,
            name: record.name,
            isActive: record.isActive,
          }
          this.lst.unshift(newRowData);
          this.gridApi.updateRowData({ add: [newRowData], addIndex: 0 });
          this.router.navigate(['admin/coin-master/']);
        }
      });

    this.updateSubscription = recordCreationService.recordUpdated$.subscribe(
      record => {
        if (record.table == 'C-M') {

          let newRowData = this.lst.filter((row: any) => {
            if (row.id == record.id) {
              var newRow = row;

              //change here only
              newRow.name = record.name;
              newRow.isActive = record.isActive;
              //********************** */

              return newRow;
            }
          });

          this.gridApi.updateRowData({ update: [newRowData] });
          this.router.navigate(['admin/coin-master/']);
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

  setGridHeight() {

    this.gridHeightWidth = {
      width: '100%',
      height: (window.innerHeight * appCommon.GridHeightPer).toString() + 'px',
    };
  }

  clear() {
    this.createSearchForm();
    this.submitSearch();
  }

  back() {
    if (this.isChildRouteActive) {
      this.router.navigate(['admin/coin-master/']);
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
      } else {
        this.submitGroupExportToExcel();
      }
    }
  }

  submitGroupExportToExcel() {
    this.isBtnLoading = true;

    // this.service.Export(fdata)
    //   .subscribe(data => {
    //     if (data.size) {
    //       const a = document.createElement('a');
    //       const objectUrl = URL.createObjectURL(data);
    //       a.href = objectUrl;
    //       a.setAttribute("download", 'GroupExport.xlsx');
    //       a.click();
    //       URL.revokeObjectURL(objectUrl);
    //     }
    //     else { this.toastrMessageService.showInfo('No data found to export.', 'Info'); }
    //     this.isBtnLoading = false;
    //   },
    //     async error => {
    //       this.isBtnLoading = false;
    //       const temp = await (new Response(error)).json();
    //       this.toastrMessageService.showInfo(temp.message, 'Info');
    //     });
  }

  search() {
    var fdata = this.getFilters();
    this.isBtnLoading = true;
    this.service
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
        field: 'name', headerName: '', width: 25,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEdit.bind(this)
        },
      },
      {
        field: 'name', headerName: '', width: 25,
        cellRenderer: "deleteButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onDelete.bind(this)
        },
      },
      { field: 'coins', headerName: 'Coins', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 200, },
      { field: 'value', headerName: 'Value', sortable: true, autoHeight: true, filter: true, resizable: true, wrapText: true, width: 200, },
      {
        field: 'isActive', headerName: 'Active', sortable: true, filter: true, autoHeight: true, resizable: true, wrapText: true, width: 150,
        valueFormatter: function (params) {
          return params.value ? 'Yes' : 'No';
        },
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
      nature: null
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
    this.router.navigate(['admin/coin-master/edit/' + e.rowData.id]);
  }

  onDelete(e: any) {
    if (confirm("Are you sure want to delete record ?")) {
      this.service.delete(e.rowData.id)
        .subscribe(
          () => {
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
    this.router.navigate(['admin/coin-master/new']);
  }

  onBack() {
    this.router.navigate(['admin/coin-master/']);
  }
}
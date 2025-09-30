import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { NotificationService } from 'src/app/providers/services/notification.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { AgEditButtonRendererComponent } from 'src/app/shared/custom-ag-controls/ag-edit-button-renderer/ag-edit-button-renderer.component';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  searchForm: FormGroup;
  columnDefs: ColDef[];
  mlist: any = [];
  gridApi: any;
  submitLoading = false;
  isChildRouteActive: boolean = false;
  insertSubscription: Subscription;
  updateSubscription: Subscription;
  breadcrumbTitle: String = 'List';
  pageTitle: String = 'Notification Listings';
  public appCommon = appCommon;
  gridHeightWidth: any = {};
  isSubmitBtnLoading: boolean = false;
  isAllRead: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrMessageService,
    private recordCreationService: RecordCreationService,
    private _location: Location,
    private toastrMessageService: ToastrMessageService,
    private modalService: NgbModal,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        //console.log('val -', event);
        this.isChildRouteActive = event.url.indexOf('notification/details') !== -1;

        if (!this.isChildRouteActive) {
          this.breadcrumbTitle = 'List';
          this.pageTitle = 'Notifications';
        }
        else {
          if (event.url.indexOf('notification/details') !== -1) {
            this.breadcrumbTitle = 'Details';
            this.pageTitle = 'Notification Details';
          }
        }
      });
  }

  ngOnInit(): void {
    this.setGridHeight();
    this.search();
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

  back() {
    this._location.back();
  }

  search() {
    var fdata = {};
    this.notificationService.notificationList(fdata).subscribe(
      data => {
        if (data.data.totalCount > 0) {
          for (var i = 0; i < data.data.list.length; i++) {
            var ele = data.data.list[i];

            this.mlist.unshift(ele);
          }
        }

        this.isAllRead = this.mlist.some(obj => obj.isRead === false);

        this.gridApi.setRowData(this.mlist);
        this.submitLoading = false;
      },
      error => {
        this.submitLoading = false;
        this.toastr.showInfo(error.error.message, "Info");
        this.mlist = [];
        this.gridApi.setRowData(this.mlist);
      });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    this.columnDefs = [
      { headerName: '#', valueGetter: "node.rowIndex + 1", sortable: true, width: 60 },
      {
        field: 'date', headerName: 'Date', sortable: true, filter: true, resizable: true, width: 175,
        valueFormatter: function (params) {
          return moment(params.value).format('DD/MM/yyyy hh:mm A');
        }
      },
      { field: 'subject', headerName: 'Subject', sortable: true, filter: true, resizable: true, width: 200, },
      { field: 'result', headerName: 'Result', wrapText: true, autoHeight: true, sortable: true, filter: true, resizable: true, width: 350, cellRenderer: this.ResultRendererfunction.bind(this), },
      {
        field: 'isRead', headerName: 'Is Read', sortable: true, filter: true, resizable: true, width: 150, cellRenderer: (data) => {
          return data.value ? 'Yes' : 'No'
        }
      },
      {
        field: 'id', headerName: '', width: 60,
        cellRenderer: "editButtonRendererComponent",
        cellRendererParams: {
          onClick: this.onEditClick.bind(this)
        },
      }
    ];

  }

  ResultRendererfunction(params: any) {
    //console.log('params.value - ', params.value);
    if (!params.value) return '';


    return "<p style='line-height:15px;'>" + params.value.replace(/\n/g, "<br>") + "</p>";
  }

  frameworkComponents = { editButtonRendererComponent: AgEditButtonRendererComponent };

  onEditClick(item: any) {
    this.router.navigate(['notification/details/' + + item.rowData.id]);
    this.markRead(item.rowData)
  }

  markRead(item: any): void {
    if (!item.isRead) {
      this.notificationService.markReadNotification(item.id)
        .subscribe(
          data => {
            let newRowData = this.mlist.filter((row: any) => {
              if (row.id == item.id) {
                var newRow = row;
                //change here only             
                newRow.isRead = !item.isRead;
                //********************** */
                return newRow;
              }
            })[0];

            this.gridApi.setRowData(this.mlist);

            this.recordCreationService.announceReadNotification(newRowData);
          },
          error => { }
        )
    }
  }

  markReadAll(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Confirm Mark Read All';
    modalRef.componentInstance.message = 'Are you sure you want to mark all notification as read.';
    modalRef.result.then(result => {
      if (result) {
        this.isSubmitBtnLoading = false;
        this.isAllRead = false;
        this.notificationService.markReadAllNotification()
          .subscribe(
            data => {
              this.mlist.forEach(v => { v.isRead = true; });
              this.gridApi.setRowData(this.mlist);
              this.recordCreationService.announceReadAllNotification();
              this.toastrMessageService.showSuccess("Notification marked as read successfully.", "Info");
            },
            error => {
              this.isSubmitBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
    });
  }
}
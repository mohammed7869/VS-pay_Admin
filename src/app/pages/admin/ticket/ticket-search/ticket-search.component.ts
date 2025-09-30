import { formatDate, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { MasterValueService } from 'src/app/providers/services/master-value.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { TicketService } from 'src/app/providers/services/ticket.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { TicketReplyModelComponent } from 'src/app/shared/ticket-reply-model/ticket-reply-model.component';
@Component({
  selector: 'app-ticket-search',
  templateUrl: './ticket-search.component.html',
  styleUrls: ['./ticket-search.component.scss']
})
export class TicketSearchComponent implements OnInit {

  form: FormGroup;
  lst: any = [];
  subjectList: any = [];
  applicantList: any = [];
  isBtnLoading: boolean = false;
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  public appCommon = appCommon;
  isChildRouteActive: boolean = false;
  breadcrumbTitle: String = 'List';
  pageTitle: String = 'Ticket';
  issbtBtnLoading: boolean = false;
  applicationData: any;
  isApplicationData: boolean = false;
  userData: any = null;
  isTicketForMe: boolean = null;
  filterLst: any = [];
  selectedStatus: any = null;

  constructor(
    private toastrMessageService: ToastrMessageService,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private _location: Location,
    private masterValueService: MasterValueService,
    private authServiceService: AuthServiceService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService) {
    this.userData = this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo);
    this.breadcrumbTitle = 'List';
    this.pageTitle = 'Ticket';
    this.applicationData = this.localStorageService.getItem(appCommon.LocalStorageKeyType.ApplicationData);
    if (this.applicationData) {
      this.isApplicationData = true;
      this.localStorageService.removeItem(appCommon.LocalStorageKeyType.ApplicationData);
    }
    this.createForm(this.applicationData);
  }

  ngOnInit(): void {
    this.getTicketNo();
    this.search();
    this.getSubjectList();
    this.getApplicants();
  }

  createForm(item: any): void {
    this.form = this.fb.group({
      id: [0],
      ticketNo: [null, Validators.required],
      applicationNo: [item ? item.applicationNo : 0],
      date: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      ticketSubject: ["", Validators.required],
      status: [0],
      description: [null, Validators.required],
      applicantId: [0],
      assignedToUserId: [item ? item.accountId : 0],
    });
  }

  getApplicants() {
    this.authServiceService
      .listApplicants({})
      .subscribe(
        data => {
          this.applicantList = data.data;
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  applicantSelectionFormatter = (x: { fullName: string }) => x.fullName;

  applicantSelectionFilter: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.applicantList
            .filter(
              (v: any) =>
                v.fullName.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
            .slice(0, 10)
      )
    );

  onClear() {
    this.form.patchValue({ applicationNo: "" })
  }

  getTicketNo() {
    this.ticketService
      .getNextTicketNo()
      .subscribe(
        data => {
          this.form.patchValue({ ticketNo: data.data });
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  getSubjectList() {
    var fdata = { type: 7 };
    this.masterValueService
      .dropdownList(fdata)
      .subscribe(
        data => {
          this.subjectList = data.data;

          var sub = this.subjectList.filter(x => x.text.toLowerCase() == 'application', true)[0];
          if (this.applicationData && sub) this.form.patchValue({ ticketSubject: sub.id });
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  ngAfterViewInit() {
  }

  back() {
    this._location.back();
  }

  search() {
    var fdata = {};
    this.isBtnLoading = true;
    this.ticketService
      .adminList(fdata)
      .subscribe(
        data => {
          this.isBtnLoading = false;
          this.lst = data.data.list;
          this.filterLst = data.data.list;
        },
        error => {
          this.isBtnLoading = false;
          this.toastrMessageService.showInfo(error.error.message, "Info");
          this.lst = [];
        });
  }

  onEdit() {
  }

  clear() {
    this.createForm(null);
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      this.issbtBtnLoading = true;
      var fdata = this.form.value;
      fdata.ticketNo = fdata.ticketNo.toString();
      fdata.assignedToUserId = fdata.assignedToUserId ? fdata.assignedToUserId.id : null;

      this.ticketService.adminAddTicket(fdata)
        .subscribe(
          data => {
            var newRec = data.data;
            newRec.ownTicket = true;
            var rec = this.subjectList.filter(x => x.id == newRec.ticketSubject)[0];
            if (rec) newRec.ticketSubjectText = rec.text;

            this.lst.unshift(newRec);

            this.clearTicket();
            this.issbtBtnLoading = false;
            this.toastrMessageService.showSuccess("Ticket raised successfully.", "Info");
          },
          error => {
            this.issbtBtnLoading = false;
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }

  clearTicket() {
    this.submitted = false;
    this.createForm(null);
    this.getTicketNo();
  }

  onSubjectChange() { }

  openPopup(item: any): void {
    const modalRef = this.modalService.open(TicketReplyModelComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.data = { data: JSON.parse(JSON.stringify(item)) };

    modalRef.componentInstance.passdata.subscribe((v) => {
      v.data.ticketSubjectText = this.subjectList.filter(x => x.id == v.data.ticketSubject)[0].text;
      var index = this.lst.findIndex(x => x.id == v.data.id);
      this.lst[index] = v.data;
      var findex = this.filterLst.findIndex(x => x.id == v.data.id);
      this.filterLst[findex] = v.data;
    })
  }

  onTicketForChange(item, status) {
    this.selectedStatus = status;
    this.isTicketForMe = item;
    if (item == null) { this.filterLst = this.lst; }
    else if (status) { this.filterLst = this.lst.filter(x => x.ownTicket == item && x.status == status); }
    else { this.filterLst = this.lst.filter(x => x.ownTicket == item); }
  }
}


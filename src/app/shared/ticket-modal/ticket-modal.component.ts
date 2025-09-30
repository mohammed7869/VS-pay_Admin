import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { appCommon } from 'src/app/common/_appCommon';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { MasterValueService } from 'src/app/providers/services/master-value.service';
import { TicketService } from 'src/app/providers/services/ticket.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-ticket-modal',
  templateUrl: './ticket-modal.component.html',
  styleUrls: ['./ticket-modal.component.scss']
})
export class TicketModalComponent implements OnInit {

  messageform: FormGroup;
  @Input() public data;
  @Output() passdata: EventEmitter<any> = new EventEmitter();
  ticketData: any = null;
  isBtnLoading: boolean = false;
  isCloseTicketBtnLoading: boolean = false;
  submitted: boolean = false;
  applicationData: any = null;
  subjectList: any = [];
  issbtBtnLoading: boolean = false;
  userData: any = null;
  public appCommon = appCommon;

  constructor(
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastrMessageService: ToastrMessageService,
    private ticketService: TicketService,
    private masterValueService: MasterValueService,
    private localStorageService: LocalStorageService
  ) { this.userData = this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo); }

  ngOnInit(): void {
    this.applicationData = this.data.applicationData;
    this.createNewMessageForm(this.applicationData);
    this.getSubjectList();
    this.getTicketNo();
  }

  createNewMessageForm(item): void {
    this.messageform = this.formBuilder.group({
      id: [0],
      ticketNo: [null],
      applicationNo: [this.applicationData.applicationNo],
      date: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
      ticketSubject: [""],
      status: [0],
      description: [null, Validators.required],
    });
  }

  getTicketNo() {
    this.ticketService
      .getNextTicketNo()
      .subscribe(
        data => {
          this.messageform.patchValue({ ticketNo: data.data });
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
          if (this.applicationData && sub) this.messageform.patchValue({ ticketSubject: sub.id })
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  get formData() { return this.messageform.controls; }

  closeDialog(data) {
    this.passdata.emit({ data: data });
    //this.activeModal.close();
  }

  close() {
    this.activeModal.close();
  }

  submitNewMessage(): void {
    this.submitted = true;
    if (this.messageform.invalid) {
      console.log(this.messageform.errors);
      return;
    }
    else {
      this.issbtBtnLoading = true;
      var fdata = this.messageform.value;
      fdata.ticketNo = fdata.ticketNo.toString();

      if (this.userData.role == 'Auditor') {
        this.ticketService.auditorToApplicantTicket(fdata)
          .subscribe(
            data => {
              this.activeModal.dismiss();
              this.issbtBtnLoading = false;
              this.toastrMessageService.showSuccess("Message sent successfully.", "Info");
            },
            error => {
              this.issbtBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      } else {
        this.ticketService.adminAddTicket(fdata)
          .subscribe(
            data => {
              this.activeModal.dismiss();
              this.issbtBtnLoading = false;
              this.toastrMessageService.showSuccess("Message sent successfully.", "Info");
            },
            error => {
              this.issbtBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
    }
  }
}

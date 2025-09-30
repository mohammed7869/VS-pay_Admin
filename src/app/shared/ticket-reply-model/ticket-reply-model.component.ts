import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from 'src/app/providers/services/ticket.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-ticket-reply-model',
  templateUrl: './ticket-reply-model.component.html',
  styleUrls: ['./ticket-reply-model.component.scss']
})
export class TicketReplyModelComponent implements OnInit {

  form: FormGroup;
  @Input() public data;
  @Output() passdata: EventEmitter<any> = new EventEmitter();
  ticketData: any = null;
  isBtnLoading: boolean = false;
  isCloseTicketBtnLoading: boolean = false;
  submitted: boolean = false;
  subjectList: any = [];
  isReplySucess: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastrMessageService: ToastrMessageService,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.ticketData = this.data.data;
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      text: ['', [Validators.required]],
    });
  }

  closeDialog(data) {
    this.passdata.emit({ data: data });
    this.activeModal.close();
  }

  close() {
    this.activeModal.close();
  }

  submitRelpy(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      this.isBtnLoading = true;

      var fdata: any = {};
      console.log(fdata);

      fdata = this.ticketData;
      fdata.reply = this.form.value.text;

      this.ticketService.replyMessage(fdata)
        .subscribe(
          data => {

            this.isBtnLoading = false;
            this.ticketData = data.data;
            this.closeDialog(data.data);
            this.toastrMessageService.showSuccess("Message Replied successfully.", "Info");
            this.isReplySucess = true;
          },
          error => {
            this.isBtnLoading = false;
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }
}
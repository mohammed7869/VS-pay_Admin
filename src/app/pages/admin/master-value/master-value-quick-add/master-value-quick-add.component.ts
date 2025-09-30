import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { appCommon } from 'src/app/common/_appCommon';
import { MasterValueService } from 'src/app/providers/services/master-value.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-master-value-quick-add',
  templateUrl: './master-value-quick-add.component.html',
  styleUrls: ['./master-value-quick-add.component.scss']
})
export class MasterValueQuickAddComponent implements OnInit {
  form: FormGroup;
  isBtnLoading: boolean = false;
  public appCommon = appCommon;
  submitted: boolean = false;
  @Output() passdata: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder,
    private masterValueService: MasterValueService,
    private toastrMessageService: ToastrMessageService,
    private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      text: [null, Validators.required],
      description: [null],
      type: [6, Validators.required],
      isPublished: [true],
    });
  }

  passBack() {
    this.activeModal.dismiss();
  }

  clear() {
    this.form.reset();
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      this.isBtnLoading = true;
      var fdata = this.form.value;
      console.log(fdata);

      this.masterValueService.create(fdata)
        .subscribe(
          data => {
            this.isBtnLoading = false;
            this.toastrMessageService.showSuccess("New Process remark added successfully.", "Info");
            var listRec = {
              id: data.data.id,
              text: this.form.value.text,
              description: this.form.value.description,
              type: this.form.value.type,
              isPublished: this.form.value.isPublished,
            };
            this.closeDialog(listRec);
          },
          error => {
            this.isBtnLoading = false;
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }

  closeDialog(data: any) {
    this.passdata.emit({ data: data });
    this.activeModal.close();
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { MasterValueService } from 'src/app/providers/services/master-value.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-master-value-new',
  templateUrl: './master-value-new.component.html',
  styleUrls: ['./master-value-new.component.scss']
})
export class MasterValueNewComponent implements OnInit {
  form: FormGroup;
  isBtnLoading: boolean = false;
  loginSuccessSubscription: Subscription;
  public appCommon = appCommon;
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  recordData: any = {};

  isApproveBtnLoading: boolean = false;
  isRejectBtnLoading: boolean = false;

  constructor(private fb: FormBuilder,
    private masterValueService: MasterValueService,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService) {
  }

  ngOnInit(): void {

    this.createForm();
    if (this.route.snapshot.data['recordData']) {
      this.recordData = this.route.snapshot.data['recordData'].data;
      this.setFormValues();
    }
  }

  setFormValues() {
    if (this.recordData) {
      this.form.patchValue({
        id: this.recordData.id,
        text: this.recordData.text,
        description: this.recordData.description,
        type: this.recordData.type,
        isPublished: this.recordData.isPublished,
        accountId: this.recordData.accountId,
      });
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      text: [null, Validators.required],
      description: [null],
      type: [null, Validators.required],
      isPublished: [true],
      accountId: [null],
    });
  }


  clear() {
    if (this.recordData) {
      this.setFormValues();
    }
    else {
      this.form.reset();
    }
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

      if (fdata.id) {
        this.masterValueService.update(fdata)
          .subscribe(
            data => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record updated successfully.", "Info");

              var listRec = {
                table: 'Master Value',
                id: this.form.value.id,
                text: this.form.value.text,
                description: this.form.value.description,
                type: this.form.value.type,
                isPublished: this.form.value.isPublished,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/master-value']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
      else {
        this.masterValueService.create(fdata)
          .subscribe(
            data => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record created successfully.", "Info");

              var listRec = {
                table: 'Master Value',
                id: data.data.id,
                text: this.form.value.text,
                description: this.form.value.description,
                type: this.form.value.type,
                isPublished: this.form.value.isPublished,
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/master-value']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
    }
  }

  approveNewMVRequest(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      this.isApproveBtnLoading = true;
      var fdata = this.form.value;
      console.log(fdata);

      this.masterValueService.approveNewMVRequest(fdata)
        .subscribe(
          data => {
            this.isApproveBtnLoading = false;
            this.toastrMessageService.showSuccess("Record updated successfully.", "Info");

            var listRec = {
              table: 'Master Value',
              id: this.form.value.id,
              text: this.form.value.text,
              description: this.form.value.description,
              type: this.form.value.type,
              isPublished: this.form.value.isPublished,
              accountId: null
            };
            this.recordCreationService.announceUpdate(listRec);
            this.router.navigate(['admin/master-value']);
          },
          error => {
            this.isApproveBtnLoading = false;
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }

  rejectNewMVRequest(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    else {
      this.isRejectBtnLoading = true;
     
      this.masterValueService.rejectNewMVRequest(this.form.value.id)
        .subscribe(
          data => {
            this.isRejectBtnLoading = false;
            this.toastrMessageService.showSuccess("Record updated successfully.", "Info");

            var listRec = {
              table: 'Master Value',
              id: this.form.value.id,
              text: this.form.value.text,
              description: this.form.value.description,
              type: this.form.value.type,
              isPublished: this.form.value.isPublished,
              accountId: null
            };
            this.recordCreationService.announceUpdate(listRec);
            this.router.navigate(['admin/master-value']);
          },
          error => {
            this.isRejectBtnLoading = false;
            this.toastrMessageService.showInfo(error.error.message, "Info");
          }
        )
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { appCommon } from 'src/app/common/_appCommon';
import { IfscCodeService } from 'src/app/providers/services/ifsc-code.service';
import { MasterValueService } from 'src/app/providers/services/master-value.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-ifsc-code-new',
  templateUrl: './ifsc-code-new.component.html',
  styleUrls: ['./ifsc-code-new.component.scss']
})
export class IfscCodeNewComponent implements OnInit {


  form: FormGroup;
  isBtnLoading: boolean = false;
  loginSuccessSubscription: Subscription;
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  recordData: any = {};
  public appCommon = appCommon;
  stateList: any = [];
  cityList: any = [];

  constructor(private fb: FormBuilder,
    private ifscCodeService: IfscCodeService,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService,
    private masterValueService: MasterValueService,) {
    this.getSateList();
    this.getCityList();
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
        bankName: this.recordData.bankName,
        code: this.recordData.code,
        branch: this.recordData.branch,
        city1: this.recordData.city1,
        address: this.recordData.address,
        city2: this.recordData.city2,
        state: this.recordData.state,
        stdCode: this.recordData.stdCode,
        phone: this.recordData.phone,
      });
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      bankName: [null, Validators.required],
      code: [null, Validators.required],
      branch: [null, Validators.required],
      city1: [null, Validators.required],
      address: [null],
      city2: [null],
      state: [null, Validators.required],
      stdCode: [null],
      phone: [null],
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

      var state = this.stateList.filter((x: any) => x.id == this.form.value.state)[0];
      var city1 = this.cityList.filter((x: any) => x.id == this.form.value.city1)[0];
      var city2 = this.cityList.filter((x: any) => x.id == this.form.value.city2)[0];

      if (fdata.id) {
        this.ifscCodeService.update(fdata)
          .subscribe(
            data => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record updated successfully.", "Info");

              var listRec = {
                table: 'IFSC',
                id: this.form.value.id,
                bankName: this.form.value.bankName,
                code: this.form.value.code,
                branch: this.form.value.branch,
                city1: this.form.value.city1,
                city1Text: city1?.text,
                address: this.form.value.address,
                city2: this.form.value.city2,
                city2Text: city2?.text,
                state: this.form.value.state,
                stateText: state?.text,
                stdCode: this.form.value.stdCode,
                phone: this.form.value.phone,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/ifsc-code']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
      else {
        this.ifscCodeService.create(fdata)
          .subscribe(
            data => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record created successfully.", "Info");

              var listRec = {
                table: 'IFSC',
                id: data.data.id,
                bankName: this.form.value.bankName,
                code: this.form.value.code,
                branch: this.form.value.branch,
                city1: this.form.value.city1,
                city1Text: city1?.text,
                address: this.form.value.address,
                city2: this.form.value.city2,
                city2Text: city2?.text,
                state: this.form.value.state,
                stateText: state?.text,
                stdCode: this.form.value.stdCode,
                phone: this.form.value.phone,
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/ifsc-code']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
    }
  }

  getSateList(): void {
    var fdata = { type: 2 };
    this.masterValueService.dropdownList(fdata)
      .subscribe(
        data => {
          this.stateList = data.data;
        }
      )
  }

  getCityList(): void {
    var fdata = { type: 1 };
    this.masterValueService.dropdownList(fdata)
      .subscribe(
        data => {
          this.cityList = data.data;
        }
      )
  }

  setUpperCase(event: any) {
    this.form.controls['code'].setValue(event.target.value.toUpperCase());
  }
}

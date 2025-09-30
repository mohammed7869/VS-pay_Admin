import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoinMasterService } from 'src/app/providers/services/coin-master.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-coin-master-new',
  templateUrl: './coin-master-new.component.html',
  styleUrls: ['./coin-master-new.component.scss']
})
export class CoinMasterNewComponent implements OnInit {
  form: FormGroup;
  groupList: any = [];
  isBtnLoading: boolean = false;
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  recordData: any = {};

  constructor(private fb: FormBuilder,
    private service: CoinMasterService,
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

  ngAfterViewInit() {

  }

  setFormValues() {
    if (this.recordData) {
      this.form.patchValue({
        id: this.recordData.id,
        name: this.recordData.name,
        isActive: this.recordData.isActive,
      });
    }
  }

  ngOnDestroy(): void {

  }

  createForm(): void {

    this.form = this.fb.group({
      id: [0],
      coin: [0, Validators.required],
      value: [0, Validators.required],
      isActive: [false]
    });
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
        this.service.update(fdata)
          .subscribe(
            () => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record updated successfully.", "Info");

              var listRec = {
                table: 'C-M',
                id: this.form.value.id,
                name: this.form.value.name,
                isActive: this.form.value.isActive,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/coin-master']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
      else {
        this.service.create(fdata)
          .subscribe(
            data => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record created successfully.", "Info");

              var listRec = {
                table: 'C-M',
                id: data.data.id,
                name: this.form.value.name,
                isActive: this.form.value.isActive,
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/coin-master']);
            },
            error => {
              this.isBtnLoading = false;
              this.toastrMessageService.showInfo(error.error.message, "Info");
            }
          )
      }
    }
  }

  clear() {
    if (this.recordData) {
      this.setFormValues();
    }
    else {
      this.form.reset();
    }
  }
}
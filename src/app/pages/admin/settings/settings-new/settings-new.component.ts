import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { SettingsService } from 'src/app/providers/services/settings.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Editor, Toolbar, toHTML } from 'ngx-editor';

@Component({
  selector: 'app-settings-new',
  templateUrl: './settings-new.component.html',
  styleUrls: ['./settings-new.component.scss']
})
export class SettingsNewComponent implements OnInit {
  form: FormGroup;
  groupList: any = [];
  isBtnLoading: boolean = false;
  isOnItEvent: boolean = false;
  submitted: boolean = false;
  recordData: any = {};
  public Editor = ClassicEditor;

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private fb: FormBuilder,
    private service: SettingsService,
    private toastrMessageService: ToastrMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService) {
  }

  ngOnInit(): void {
    this.editor = new Editor();
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
        description: this.recordData.description,
      });
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      description: [null, Validators.required],
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
      fdata.description = typeof fdata.description === 'object' ? toHTML(fdata.description) : fdata.description;
      if (fdata.id) {
        this.service.update(fdata)
          .subscribe(
            () => {
              this.isBtnLoading = false;
              this.toastrMessageService.showSuccess("Record updated successfully.", "Info");

              var listRec = {
                table: 'setting',
                id: this.form.value.id,
                description: this.form.value.description,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['admin/setting']);
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
                table: 'setting',
                id: data.data.id,
                description: this.form.value.description,
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['admin/setting']);
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
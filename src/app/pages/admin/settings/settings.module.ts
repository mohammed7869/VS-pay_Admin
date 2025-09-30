import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsSearchComponent } from './settings-search/settings-search.component';
import { SettingsNewComponent } from './settings-new/settings-new.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SettingsResolver } from 'src/app/providers/resolver/settings.resolver';
import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    SettingsSearchComponent,
    SettingsNewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsSearchComponent,
        children: [
          {
            path: 'new',
            component: SettingsNewComponent
          },
          {
            path: 'edit/:id',
            component: SettingsNewComponent,
            resolve: {
              recordData: SettingsResolver
            }
          }
        ]
      }
    ]),
    AgGridModule,
    CKEditorModule,
    NgxEditorModule
  ]
})
export class SettingsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUserSearchComponent } from './app-user-search/app-user-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModuleCommon } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { AppUserDetailsComponent } from './app-user-details/app-user-details.component';
import { AppUserResolver } from 'src/app/providers/resolver/app-user.resolver';
import { SuperAdminUserDetailsComponentComponent } from './super-admin-user-details-component/super-admin-user-details-component.component';
import { AppUserAllTrasactionComponent } from './app-user-all-trasaction/app-user-all-trasaction.component';

@NgModule({
  declarations: [
    AppUserSearchComponent,
    AppUserDetailsComponent,
    SuperAdminUserDetailsComponentComponent,
    AppUserAllTrasactionComponent
  ],
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    CommonModule,
    SharedModuleCommon,
    RouterModule.forChild([
      {
        path: '',
        component: AppUserSearchComponent,
        children: [
          {
            path: 'new',
            component: AppUserDetailsComponent
          },
          {
            path: 'edit/:id',
            component: AppUserDetailsComponent,
            resolve: {
              recordData: AppUserResolver
            }
          },
          {
            path: 'superadmin/:id',
            component: SuperAdminUserDetailsComponentComponent,
          }
        ]
      },
      {
        path: 'all-trasactions',
        component: AppUserAllTrasactionComponent,       
      },
    ]),
    AgGridModule,
    NgbModule,
    FormsModule
  ]
})
export class AppUserModule { }

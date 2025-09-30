import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinMasterSearchComponent } from './coin-master-search/coin-master-search.component';
import { CoinMasterNewComponent } from './coin-master-new/coin-master-new.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CoinMasterResolver } from 'src/app/providers/resolver/coin-master.resolver';



@NgModule({
  declarations: [
    CoinMasterSearchComponent,
    CoinMasterNewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbCollapseModule,
    RouterModule.forChild([
      {
        path: '',
        component: CoinMasterSearchComponent,
        children: [
          {
            path: 'new',
            component: CoinMasterNewComponent
          },
          {
            path: 'edit/:id',
            component: CoinMasterNewComponent,
            resolve: {
              recordData: CoinMasterResolver
            }
          }
        ]
      }
    ]),
    AgGridModule
  ]
})
export class CoinMasterModule { }

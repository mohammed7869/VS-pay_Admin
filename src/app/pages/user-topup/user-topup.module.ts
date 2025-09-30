import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserTopupRoutingModule } from './user-topup-routing.module';
import { UserTopupComponent } from './user-topup.component';

@NgModule({
  declarations: [
    UserTopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserTopupRoutingModule
  ]
})
export class UserTopupModule { }

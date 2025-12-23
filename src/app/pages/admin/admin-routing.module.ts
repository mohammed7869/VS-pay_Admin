import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'bank-account',
    loadChildren: () => import('./bank-account/bank-account.module').then((m) => m.BankAccountModule)
  },
  {
    path: 'master-value',
    loadChildren: () => import('./master-value/master-value.module').then((m) => m.MasterValueModule)
  },
  {
    path: 'ticket',
    loadChildren: () => import('./ticket/ticket.module').then((m) => m.TicketModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'custom-message',
    loadChildren: () => import('./custom-message/custom-message.module').then((m) => m.CustomMessageModule)
  },
  {
    path: 'email-setting',
    loadChildren: () => import('./email-setting/email-setting.module').then((m) => m.EmailSettingModule)
  },
  {
    path: 'email-template',
    loadChildren: () => import('./email-template/email-template.module').then((m) => m.EmailTemplateModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule)
  },
  {
    path: 'ifsc-code',
    loadChildren: () => import('./ifsc-code/ifsc-code.module').then((m) => m.IfscCodeModule)
  },
  {
    path: 'bank-account',
    loadChildren: () => import('./bank-account/bank-account.module').then((m) => m.BankAccountModule)
  },
  {
    path: 'coin-master',
    loadChildren: () => import('./coin-master/coin-master.module').then((m) => m.CoinMasterModule)
  },
  {
    path: 'app-users',
    loadChildren: () => import('./app-user/app-user.module').then((m) => m.AppUserModule)
  },
  {
    path: 'transaction-history',
    redirectTo: 'app-users/transaction-history',
    pathMatch: 'full'
  },
  {
    path: 'topup-approval',
    loadChildren: () => import('./topup-approval/topup-approval.module').then((m) => m.TopupApprovalModule)
  },
  {
    path: '',
    redirectTo: '/error/404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

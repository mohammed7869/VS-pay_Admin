import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'notification', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule) },
    { path: 'user-topup', loadChildren: () => import('./user-topup/user-topup.module').then(m => m.UserTopupModule) },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }

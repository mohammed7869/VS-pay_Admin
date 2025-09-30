import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { CommonService } from 'src/app/providers/services/common.service';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   public appCommon = appCommon;
//   userData: any = {};

//   constructor(private router: Router, private localStorageService: LocalStorageService, private commonService: CommonService) {
//     this.userData = commonService.getUserData();
//   }

//   canActivate(route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot) {
//     if (this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo))
//       return true;
//     if (this.userData) {
//       if (!this.userData.type) {
//         this.router.navigate(['/auth/admin']);
//       } else if (this.userData.type == 'ITS') {
//         window.location.href = environment.itsOneLogin;
//       } else if (this.userData.type == 'Staff') {
//         this.router.navigate(['/auth/user']);
//       }
//     }
//     return false;
//   }
// }
export class AuthGuard implements CanActivate {
  constructor(private router : Router) {}

    canActivate(route: ActivatedRouteSnapshot, 
      state : RouterStateSnapshot){
          if(localStorage.getItem('tokenInfo'))
              return true;

          this.router.navigate(['/login']);
          return false;
      }
}
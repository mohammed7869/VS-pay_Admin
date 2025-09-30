import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { appCommon } from './common/_appCommon';
import { LocalStorageService } from './providers/services/local-storage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Imdad Tamili';

  userData: any = null;
  public appCommon = appCommon;


  constructor(private router: Router, private localStorageService: LocalStorageService, private location: Location) {
    this.userData = this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo);
  }

  ngOnInit(): void {
    if (!this.userData && (this.location.path() === '/' || this.location.path() === "")) { this.router.navigate(['/admin']); }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationStart))
      .subscribe((event: any) => {
      });
  }
}

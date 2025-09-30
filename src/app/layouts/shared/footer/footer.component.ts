import { Component, OnInit } from '@angular/core';
import { appCommon } from 'src/app/common/_appCommon';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  userData: any = null;
  public appCommon = appCommon;
   // set the currenr year
   year: number = new Date().getFullYear();

  constructor(private localStorageService: LocalStorageService) {this.userData = this.localStorageService.getItem(appCommon.LocalStorageKeyType.TokenInfo); }

  ngOnInit(): void {
  }

}

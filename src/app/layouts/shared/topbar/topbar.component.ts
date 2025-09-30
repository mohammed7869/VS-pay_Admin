import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { NotificationService } from 'src/app/providers/services/notification.service';
import { Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/providers/services/common.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  configData: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset: string;
  userData: any = {};
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  searchFilter: any = {};
  notifyInterval = null;
  lastDate = null;
  recordlist = [];
  searchCount: number = 0;
  public appCommon = appCommon;
  notificationSubscription: Subscription;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private authService: AuthServiceService,
    public languageService: LanguageService,
    public cookiesService: CookieService,
    public notificationService: NotificationService,
    private router: Router,
    commonService: CommonService,
    recordCreationService: RecordCreationService) {
    this.userData = commonService.getUserData();
    this.notificationSubscription = recordCreationService.readNotificationUpdated$.subscribe(
      record => {
        var index = this.recordlist.findIndex(x => x.id == record.id);
        this.recordlist.splice(index, 1);
        this.searchCount = this.searchCount - 1;
      });

    this.notificationSubscription = recordCreationService.readAllNotificationUpdated$.subscribe(
      () => {
        this.recordlist = [];
        this.searchCount = 0;
      });
  }

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();

  ngOnInit(): void {
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    //this.list();

    this.notifyInterval = setInterval(() => {
      //this.list();
    }, 35000);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
   * Translate language
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }


  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
  }

  setfilters(): void {

    this.searchFilter.lastDate = this.lastDate;
    return this.searchFilter;
  }

  list(): void {

    var fdata = this.setfilters();

    this.notificationService.unreadNotificationList(fdata)
      .subscribe(
        data => {
          // this.recordlist = data.data.list;
          //this.searchCount = data.data.totalCount;

          if (data.data.maxNotificationDate) {
            this.lastDate = data.data.maxNotificationDate;
          }

          if (data.data.totalCount > 0) {
            for (var i = 0; i < data.data.list.length; i++) {
              var ele = data.data.list[i];

              this.recordlist.unshift(ele);
            }
          }

          this.searchCount = this.recordlist.length;
        },
        () => { }
      )
  }

  ngOnDestroy() {
    if (this.notifyInterval) {
      clearInterval(this.notifyInterval);
    }
    this.notificationSubscription.unsubscribe();
  }

  onEdit(item: any, index: number) {
    this.markRead(item, index);
    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['notification/details/' + + item.id]);
  }

  markRead(item: any, index: number): void {
    this.notificationService.markReadNotification(item.id)
      .subscribe(
        () => {
          this.searchCount = this.searchCount - 1;
          this.recordlist.splice(index, 1);
        },
        () => { }
      )
  }

  onProfileClick() {
    this.router.navigate(['/applicant/profile']);
  }

  onConveyanceFormClick() {
    window.open('https://imdadtalimi.org/assets/Imdad%20Talimi%20conveyance%20araz.pdf', "_blank");
  }

  onInstructionsClick() {
    window.open('https://tinyurl.com/ImdadTalimiInstruction', "_blank");
  }
}

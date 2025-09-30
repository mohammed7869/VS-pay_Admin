import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { AuthServiceService } from 'src/app/providers/services/auth-service.service';
import { LocalStorageService } from 'src/app/providers/services/local-storage.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  isBtnLoading: boolean = false;

  // set the currenr year
  year: number = new Date().getFullYear();
  public appCommon = appCommon;
  // tslint:disable-next-line: max-line-length
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthServiceService,
    private localStorageServiceService: LocalStorageService,
    private toastrMessageService: ToastrMessageService) { }

  ngOnInit() {
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');

    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [environment.userName, Validators.required],
      password: [environment.password, Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }

  onAdminSubmit() {
    if (this.loginForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    }
    else {
      this.isBtnLoading = true;
      this.submitted = true;

      // var user = {
      //   "fullName": "Admin",
      //   "role": "SuperAdmin",
      //   "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYmYiOjE3MTk4OTg5MzEsImV4cCI6MTcxOTk4NTMzMSwiaWF0IjoxNzE5ODk4OTMxfQ.Pxp5P5NAHzHuke5apJTA1RuGcGC6L6TX_jV40oDz5L8",
      //   "refreshToken": "829974",
      //   "permissions": [
      //     1,
      //     2,
      //     3,
      //     4,
      //     5,
      //     6,
      //     7,
      //     8,
      //     9,
      //     10,
      //     11,
      //     12,
      //     13,
      //     14,
      //     15,
      //     16,
      //     17,
      //     18,
      //     19,
      //     20,
      //     21,
      //     22,
      //     23,
      //     24,
      //     25,
      //     26,
      //     27,
      //     28,
      //     29,
      //     30,
      //     31,
      //     32,
      //     33,
      //     34,
      //     35,
      //     36,
      //     37,
      //     38,
      //     39,
      //     40,
      //     41,
      //     42,
      //     43,
      //     44,
      //     45,
      //     46,
      //     47,
      //     48,
      //     49,
      //     50,
      //     51,
      //     52,
      //     53,
      //     54,
      //     55,
      //     56,
      //     57,
      //     58,
      //     59,
      //     60,
      //     61,
      //     62,
      //     63,
      //     64,
      //     65,
      //     66,
      //     67,
      //     68,
      //     69,
      //     70,
      //     71,
      //     72,
      //     73,
      //     74,
      //     75,
      //     76,
      //     77,
      //     78,
      //     79,
      //     80,
      //     81,
      //     82,
      //     83,
      //     84,
      //     85,
      //     86,
      //     87,
      //     88,
      //     89,
      //     90,
      //     91,
      //     92,
      //     93,
      //     94,
      //     95,
      //     96,
      //     97,
      //     98,
      //     99,
      //     100,
      //     101,
      //     102,
      //     103,
      //     104,
      //     105,
      //     106,
      //     107,
      //     108,
      //     109,
      //     110,
      //     111,
      //     112,
      //     113,
      //     114,
      //     115,
      //     116,
      //     117,
      //     118,
      //     119,
      //     120,
      //     121,
      //     122,
      //     123,
      //     124,
      //     125,
      //     126,
      //     127,
      //     128,
      //     129,
      //     130,
      //     131,
      //     132,
      //     133,
      //     134,
      //     135,
      //     136,
      //     137,
      //     138,
      //     139,
      //     140,
      //     141,
      //     142,
      //     143,
      //     144,
      //     145,
      //     146,
      //     147,
      //     148,
      //     149,
      //     150,
      //     151,
      //     152,
      //     153,
      //     154,
      //     155,
      //     156,
      //     157,
      //     158,
      //     159,
      //     160,
      //     161,
      //     162,
      //     163,
      //     164,
      //     165,
      //     166,
      //     167,
      //     168,
      //     169,
      //     170,
      //     171,
      //     172,
      //     173,
      //     174,
      //     175,
      //     176
      //   ],
      //   "profileCreated": false,
      //   "fromAdmin": false
      // }
      // this.localStorageServiceService.setItem(this.appCommon.LocalStorageKeyType.TokenInfo, user);
      // this.toastrMessageService.showSuccess("Login Successful", 'Success');
      // this.router.navigate(["admin"]);
      this.authService.adminLogin(this.f.email.value,
        this.f.password.value)
        .subscribe(
          data => {
            this.toastrMessageService.showSuccess("Login Successful", 'Success');
            this.router.navigate(["admin"]);
          },
          error => {
            this.error = error.message;
            this.submitted = false;
            this.isBtnLoading = false;
          }
        )
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordOtpComponent } from './forget-password-otp.component';

describe('ForgetPasswordOtpComponent', () => {
  let component: ForgetPasswordOtpComponent;
  let fixture: ComponentFixture<ForgetPasswordOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgetPasswordOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

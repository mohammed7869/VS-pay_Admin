import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordResetComponent } from './forget-password-reset.component';

describe('ForgetPasswordResetComponent', () => {
  let component: ForgetPasswordResetComponent;
  let fixture: ComponentFixture<ForgetPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgetPasswordResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

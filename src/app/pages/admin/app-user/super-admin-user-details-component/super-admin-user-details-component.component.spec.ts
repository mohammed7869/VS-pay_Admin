import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminUserDetailsComponentComponent } from './super-admin-user-details-component.component';

describe('SuperAdminUserDetailsComponentComponent', () => {
  let component: SuperAdminUserDetailsComponentComponent;
  let fixture: ComponentFixture<SuperAdminUserDetailsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminUserDetailsComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperAdminUserDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserAllTrasactionComponent } from './app-user-all-trasaction.component';

describe('AppUserAllTrasactionComponent', () => {
  let component: AppUserAllTrasactionComponent;
  let fixture: ComponentFixture<AppUserAllTrasactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUserAllTrasactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUserAllTrasactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

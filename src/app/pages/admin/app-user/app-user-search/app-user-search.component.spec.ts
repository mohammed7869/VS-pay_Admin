import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserSearchComponent } from './app-user-search.component';

describe('AppUserSearchComponent', () => {
  let component: AppUserSearchComponent;
  let fixture: ComponentFixture<AppUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUserSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

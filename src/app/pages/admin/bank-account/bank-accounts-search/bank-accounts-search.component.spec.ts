import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountsSearchComponent } from './bank-accounts-search.component';

describe('BankAccountsSearchComponent', () => {
  let component: BankAccountsSearchComponent;
  let fixture: ComponentFixture<BankAccountsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccountsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAccountsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinMasterSearchComponent } from './coin-master-search.component';

describe('CoinMasterSearchComponent', () => {
  let component: CoinMasterSearchComponent;
  let fixture: ComponentFixture<CoinMasterSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinMasterSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinMasterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

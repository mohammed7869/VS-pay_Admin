import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinMasterNewComponent } from './coin-master-new.component';

describe('CoinMasterNewComponent', () => {
  let component: CoinMasterNewComponent;
  let fixture: ComponentFixture<CoinMasterNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinMasterNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinMasterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

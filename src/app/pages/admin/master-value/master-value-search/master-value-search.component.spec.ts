import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterValueSearchComponent } from './master-value-search.component';

describe('MasterValueSearchComponent', () => {
  let component: MasterValueSearchComponent;
  let fixture: ComponentFixture<MasterValueSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterValueSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterValueSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

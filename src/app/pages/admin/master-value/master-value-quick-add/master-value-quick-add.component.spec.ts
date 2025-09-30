import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterValueQuickAddComponent } from './master-value-quick-add.component';

describe('MasterValueQuickAddComponent', () => {
  let component: MasterValueQuickAddComponent;
  let fixture: ComponentFixture<MasterValueQuickAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterValueQuickAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterValueQuickAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

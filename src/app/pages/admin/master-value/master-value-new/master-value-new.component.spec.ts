import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterValueNewComponent } from './master-value-new.component';

describe('MasterValueNewComponent', () => {
  let component: MasterValueNewComponent;
  let fixture: ComponentFixture<MasterValueNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterValueNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterValueNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfscCodeNewComponent } from './ifsc-code-new.component';

describe('IfscCodeNewComponent', () => {
  let component: IfscCodeNewComponent;
  let fixture: ComponentFixture<IfscCodeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfscCodeNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IfscCodeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

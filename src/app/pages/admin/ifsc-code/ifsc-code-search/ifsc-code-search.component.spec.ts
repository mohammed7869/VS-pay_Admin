import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IfscCodeSearchComponent } from './ifsc-code-search.component';

describe('IfscCodeSearchComponent', () => {
  let component: IfscCodeSearchComponent;
  let fixture: ComponentFixture<IfscCodeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IfscCodeSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IfscCodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

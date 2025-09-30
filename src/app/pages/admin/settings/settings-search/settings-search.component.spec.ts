import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSearchComponent } from './settings-search.component';

describe('SettingsSearchComponent', () => {
  let component: SettingsSearchComponent;
  let fixture: ComponentFixture<SettingsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

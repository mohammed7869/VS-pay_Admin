import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReplyModelComponent } from './ticket-reply-model.component';

describe('TicketReplyModelComponent', () => {
  let component: TicketReplyModelComponent;
  let fixture: ComponentFixture<TicketReplyModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketReplyModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketReplyModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChatMsgComponent } from './chat-msg.component';

describe('ChatMsgComponent', () => {
  let component: ChatMsgComponent;
  let fixture: ComponentFixture<ChatMsgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

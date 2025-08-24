import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineChatComponent } from './pipeline-chat.component';

describe('PipelineChatComponent', () => {
  let component: PipelineChatComponent;
  let fixture: ComponentFixture<PipelineChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsAuditsTransfersComponent } from './agents-audits-transfers.component';

describe('AgentsAuditsTransfersComponent', () => {
  let component: AgentsAuditsTransfersComponent;
  let fixture: ComponentFixture<AgentsAuditsTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsAuditsTransfersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsAuditsTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

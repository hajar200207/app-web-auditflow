import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalFormComponent } from './proposal-form.component';

describe('ProposalFormComponent', () => {
  let component: ProposalFormComponent;
  let fixture: ComponentFixture<ProposalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityReviewFormComponent } from './opportunity-review-form.component';

describe('OpportunityReviewFormComponent', () => {
  let component: OpportunityReviewFormComponent;
  let fixture: ComponentFixture<OpportunityReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityReviewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpportunityReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

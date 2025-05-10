import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingReviewComponent } from './training-review.component';

describe('TrainingReviewComponent', () => {
  let component: TrainingReviewComponent;
  let fixture: ComponentFixture<TrainingReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

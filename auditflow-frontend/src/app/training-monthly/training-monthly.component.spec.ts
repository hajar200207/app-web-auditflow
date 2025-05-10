import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingMonthlyComponent } from './training-monthly.component';

describe('TrainingMonthlyComponent', () => {
  let component: TrainingMonthlyComponent;
  let fixture: ComponentFixture<TrainingMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

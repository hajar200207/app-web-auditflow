import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingOperationsComponent } from './training-operations.component';

describe('TrainingOperationsComponent', () => {
  let component: TrainingOperationsComponent;
  let fixture: ComponentFixture<TrainingOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

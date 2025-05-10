import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingReportsComponent } from './training-reports.component';

describe('TrainingReportsComponent', () => {
  let component: TrainingReportsComponent;
  let fixture: ComponentFixture<TrainingReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditsPerformanceSummaryComponent } from './audits-performance-summary.component';

describe('AuditsPerformanceSummaryComponent', () => {
  let component: AuditsPerformanceSummaryComponent;
  let fixture: ComponentFixture<AuditsPerformanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditsPerformanceSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditsPerformanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

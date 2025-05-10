import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsReportComponent } from './agents-report.component';

describe('AgentsReportComponent', () => {
  let component: AgentsReportComponent;
  let fixture: ComponentFixture<AgentsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

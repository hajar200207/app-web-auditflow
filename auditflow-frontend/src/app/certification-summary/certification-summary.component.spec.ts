import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationSummaryComponent } from './certification-summary.component';

describe('CertificationSummaryComponent', () => {
  let component: CertificationSummaryComponent;
  let fixture: ComponentFixture<CertificationSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

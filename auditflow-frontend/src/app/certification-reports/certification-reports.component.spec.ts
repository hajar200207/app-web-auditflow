import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationReportsComponent } from './certification-reports.component';

describe('CertificationReportsComponent', () => {
  let component: CertificationReportsComponent;
  let fixture: ComponentFixture<CertificationReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

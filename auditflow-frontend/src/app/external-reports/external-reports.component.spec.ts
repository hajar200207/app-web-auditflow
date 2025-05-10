import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReportsComponent } from './external-reports.component';

describe('ExternalReportsComponent', () => {
  let component: ExternalReportsComponent;
  let fixture: ComponentFixture<ExternalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

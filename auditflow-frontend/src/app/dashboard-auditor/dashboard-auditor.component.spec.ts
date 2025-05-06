import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAuditorComponent } from './dashboard-auditor.component';

describe('DashboardAuditorComponent', () => {
  let component: DashboardAuditorComponent;
  let fixture: ComponentFixture<DashboardAuditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAuditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsOpportunitiesComponent } from './leads-opportunities.component';

describe('LeadsOpportunitiesComponent', () => {
  let component: LeadsOpportunitiesComponent;
  let fixture: ComponentFixture<LeadsOpportunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsOpportunitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

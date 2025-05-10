import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterPlannerComponent } from './master-planner.component';

describe('MasterPlannerComponent', () => {
  let component: MasterPlannerComponent;
  let fixture: ComponentFixture<MasterPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterPlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

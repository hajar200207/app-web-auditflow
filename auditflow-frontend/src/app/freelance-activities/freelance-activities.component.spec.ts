import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelanceActivitiesComponent } from './freelance-activities.component';

describe('FreelanceActivitiesComponent', () => {
  let component: FreelanceActivitiesComponent;
  let fixture: ComponentFixture<FreelanceActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelanceActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelanceActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

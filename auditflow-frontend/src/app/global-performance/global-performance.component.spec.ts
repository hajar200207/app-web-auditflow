import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalPerformanceComponent } from './global-performance.component';

describe('GlobalPerformanceComponent', () => {
  let component: GlobalPerformanceComponent;
  let fixture: ComponentFixture<GlobalPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

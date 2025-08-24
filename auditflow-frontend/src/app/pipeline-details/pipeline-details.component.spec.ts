import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineDetailsComponent } from './pipeline-details.component';

describe('PipelineDetailsComponent', () => {
  let component: PipelineDetailsComponent;
  let fixture: ComponentFixture<PipelineDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelineDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PipelineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

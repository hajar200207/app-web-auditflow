import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialApplicationFormComponent } from './potential-application-form.component';

describe('PotentialApplicationFormComponent', () => {
  let component: PotentialApplicationFormComponent;
  let fixture: ComponentFixture<PotentialApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotentialApplicationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotentialApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

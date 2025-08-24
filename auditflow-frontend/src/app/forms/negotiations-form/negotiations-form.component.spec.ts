import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationsFormComponent } from './negotiations-form.component';

describe('NegotiationsFormComponent', () => {
  let component: NegotiationsFormComponent;
  let fixture: ComponentFixture<NegotiationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegotiationsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NegotiationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

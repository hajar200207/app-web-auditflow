import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTemplatesComponent } from './sales-templates.component';

describe('SalesTemplatesComponent', () => {
  let component: SalesTemplatesComponent;
  let fixture: ComponentFixture<SalesTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

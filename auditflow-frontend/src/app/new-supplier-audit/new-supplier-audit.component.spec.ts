import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSupplierAuditComponent } from './new-supplier-audit.component';

describe('NewSupplierAuditComponent', () => {
  let component: NewSupplierAuditComponent;
  let fixture: ComponentFixture<NewSupplierAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSupplierAuditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSupplierAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

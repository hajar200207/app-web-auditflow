import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPackageTemplatesComponent } from './audit-package-templates.component';

describe('AuditPackageTemplatesComponent', () => {
  let component: AuditPackageTemplatesComponent;
  let fixture: ComponentFixture<AuditPackageTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPackageTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPackageTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuditPackageComponent } from './create-audit-package.component';

describe('CreateAuditPackageComponent', () => {
  let component: CreateAuditPackageComponent;
  let fixture: ComponentFixture<CreateAuditPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAuditPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAuditPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

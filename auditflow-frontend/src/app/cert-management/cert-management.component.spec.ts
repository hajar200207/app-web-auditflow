import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertManagementComponent } from './cert-management.component';

describe('CertManagementComponent', () => {
  let component: CertManagementComponent;
  let fixture: ComponentFixture<CertManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

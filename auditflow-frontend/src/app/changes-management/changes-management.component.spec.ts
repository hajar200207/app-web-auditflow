import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesManagementComponent } from './changes-management.component';

describe('ChangesManagementComponent', () => {
  let component: ChangesManagementComponent;
  let fixture: ComponentFixture<ChangesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

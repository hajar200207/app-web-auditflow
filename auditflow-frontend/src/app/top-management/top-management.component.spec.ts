import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopManagementComponent } from './top-management.component';

describe('TopManagementComponent', () => {
  let component: TopManagementComponent;
  let fixture: ComponentFixture<TopManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorsCardsComponent } from './auditors-cards.component';

describe('AuditorsCardsComponent', () => {
  let component: AuditorsCardsComponent;
  let fixture: ComponentFixture<AuditorsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditorsCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

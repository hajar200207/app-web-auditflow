import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuditNoteComponent } from './create-audit-note.component';

describe('CreateAuditNoteComponent', () => {
  let component: CreateAuditNoteComponent;
  let fixture: ComponentFixture<CreateAuditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAuditNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAuditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

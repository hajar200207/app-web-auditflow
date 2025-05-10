import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsLogComponent } from './participants-log.component';

describe('ParticipantsLogComponent', () => {
  let component: ParticipantsLogComponent;
  let fixture: ComponentFixture<ParticipantsLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantsLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantsLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

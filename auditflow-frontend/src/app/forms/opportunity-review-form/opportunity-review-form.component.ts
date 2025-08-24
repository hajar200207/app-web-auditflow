import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, CommonModule } from "@angular/common";
import { AuditOpportunity, OpportunityService } from "../../opportunity.service";

@Component({
  selector: 'app-opportunity-review-form',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './opportunity-review-form.component.html',
  styleUrls: ['./opportunity-review-form.component.css']
})
export class OpportunityReviewFormComponent {
  @Input() opportunity!: AuditOpportunity;
  @Input() disabled: boolean = false;   // ✅ correction : ajout de l’Input manquant

  @Output() opportunityChange = new EventEmitter<AuditOpportunity>();
  @Output() nextStep = new EventEmitter<void>();

  saving = false;

  constructor(private opportunityService: OpportunityService) {}

  isFormValid(): boolean {
    return (
        this.opportunity.establishPrimaryContact &&
        this.opportunity.identifyPainPoints &&
        this.opportunity.determineBudget &&
        this.opportunity.confirmTimeline
    );
  }

  onCheckboxChange(field: keyof AuditOpportunity, event: Event): void {
    if (this.disabled) return; // ✅ protège si étape verrouillée

    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    // Mise à jour locale optimiste
    (this.opportunity as any)[field] = checked;

    this.opportunityService.updateReviewSteps(this.opportunity.id, { [field]: checked })
        .subscribe({
          next: (updated) => {
            this.opportunity = { ...this.opportunity, ...updated };
            this.opportunityChange.emit(this.opportunity);
          },
          error: (err) => {
            (this.opportunity as any)[field] = !checked; // rollback
            console.error('Erreur de sauvegarde', err);
          }
        });
  }

  completeAndNext(): void {
    if (!this.isFormValid() || this.saving || this.disabled) return;

    this.saving = true;
    this.opportunityService.completeReview(this.opportunity.id)
        .subscribe({
          next: (updated) => {
            this.opportunity = { ...this.opportunity, ...updated };
            this.opportunityChange.emit(this.opportunity);
            this.saving = false;
            this.nextStep.emit(); // notifie le parent pour aller à l’étape 2
          },
          error: (err) => {
            this.saving = false;
            alert(err?.error?.message || 'Impossible de finaliser la revue');
          }
        });
  }
}

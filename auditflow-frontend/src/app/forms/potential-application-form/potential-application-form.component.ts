import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgIf, NgFor, JsonPipe} from '@angular/common';
import { OpportunityService } from "../../opportunity.service";

@Component({
    selector: 'app-potential-application-form',
    standalone: true,
    imports: [FormsModule, NgIf, JsonPipe],
    templateUrl: './potential-application-form.component.html',
    styleUrls: ['./potential-application-form.component.css']
})
export class PotentialApplicationFormComponent {
    @Input() opportunity: any = {};
    @Output() opportunityChange = new EventEmitter<any>();
    @Input() disabled!: boolean;

    isSaving = false;

    constructor(private opportunityService: OpportunityService) {}

    notifyChange(): void {
        this.opportunityChange.emit(this.opportunity);
    }

    onFileChange(event: Event, field: string) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            this.opportunity[field] = file;
            this.notifyChange(); // met à jour la validité
        }
    }


    isFormValid(): boolean {
        return !!(
            this.opportunity.applicationSentDate &&
            this.opportunity.fteNumber &&
            this.opportunity.auditFrequency &&
            this.opportunity.targetAuditDate &&
            this.opportunity.mainLanguage &&
            this.opportunity.riskLevel &&
            this.opportunity.iafCategory &&
            this.opportunity.legalRequirements &&
            this.opportunity.applicationFile &&       // fichier requis
            this.opportunity.transferDocsFile &&     // fichier requis
            this.opportunity.fqApplicationFile &&    // fichier requis
            this.opportunity.commercialRegistrationFile // fichier requis
        );
    }

    savePotentialApplication(): void {
        if (this.disabled || this.isSaving) return;

        if (!this.isFormValid()) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        this.isSaving = true;

        // Utiliser la méthode avec FormData pour gérer les fichiers
        this.opportunityService.updatePotentialApplication(this.opportunity)
            .subscribe({
                next: (saved) => {
                    this.opportunity = { ...this.opportunity, ...saved };
                    this.notifyChange();
                    console.log('Potential Application saved successfully', saved);
                    alert('Étape 2 sauvegardée avec succès !');
                    this.isSaving = false;
                },
                error: (err) => {
                    console.error('Error saving Potential Application', err);
                    alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
                    this.isSaving = false;
                }
            });
    }

    savePotentialApplicationJson(): void {
        if (this.disabled || this.isSaving) return;

        this.isSaving = true;

        this.opportunityService.updatePotentialApplicationJson(this.opportunity)
            .subscribe({
                next: (saved) => {
                    this.opportunity = { ...this.opportunity, ...saved };
                    this.notifyChange();
                    console.log('Potential Application (JSON) saved successfully', saved);
                    alert('Données de l\'étape 2 sauvegardées avec succès !');
                    this.isSaving = false;
                },
                error: (err) => {
                    console.error('Error saving Potential Application (JSON)', err);
                    alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
                    this.isSaving = false;
                }
            });
    }
}
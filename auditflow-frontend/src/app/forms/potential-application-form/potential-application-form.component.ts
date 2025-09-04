import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgIf, NgFor, JsonPipe, NgForOf} from '@angular/common';
import { OpportunityService } from "../../opportunity.service";

@Component({
    selector: 'app-potential-application-form',
    standalone: true,
    imports: [FormsModule, NgIf, JsonPipe, NgForOf],
    templateUrl: './potential-application-form.component.html',
    styleUrls: ['./potential-application-form.component.css']
})


export class PotentialApplicationFormComponent {
    @Input() opportunity: any = {};
    @Output() opportunityChange = new EventEmitter<any>();
    @Input() disabled!: boolean;

    isSaving = false;

    iafCodes = [
        { no: 1, description: 'Agriculture, fishing', usSic: '01, 02, 07, 08, 09', nace: 'A, B' },
        { no: 2, description: 'Mining and Quarrying', usSic: '10, 13, 14', nace: 'C' },
        { no: 3, description: 'Food products, beverages and tobacco', usSic: '20, 21', nace: 'DA' },
        { no: 4, description: 'Textiles and textile products', usSic: '22, 23', nace: 'DB' },
        { no: 5, description: 'Leather and Leather products', usSic: '31', nace: 'DC' },
        { no: 6, description: 'Wood and wood products', usSic: '24', nace: 'DD' },
        { no: 7, description: 'Pulp, Paper and paper products', usSic: '26', nace: 'DE 21' },
        { no: 8, description: 'Publishing companies', usSic: '27', nace: 'DE 22.1' },
        { no: 9, description: 'Printing companies', usSic: '27', nace: 'DE 22.2.3' },
        { no: 10, description: 'Manuf. of coke and refined petroleum products', usSic: '29', nace: 'DF 23.1.2' },
        { no: 11, description: 'Nuclear fuel', usSic: '-', nace: 'DF 23.3' },
        { no: 12, description: 'Chemicals, chemical products and fibers', usSic: '28', nace: 'DG MINUS 24.4' },
        { no: 13, description: 'Pharmaceuticals', usSic: '28', nace: 'DG 24.4' },
        { no: 14, description: 'Rubber and plastic products', usSic: '30', nace: 'DH' },
        { no: 15, description: 'Non-metallic mineral products', usSic: '32', nace: 'DI MINUS 26.5,6' },
        { no: 16, description: 'Concrete, cement, lime, plaster, etc.', usSic: '32', nace: 'DI 26.5,6' },
        { no: 17, description: 'Basic metals and fabricated metal products', usSic: '33, 34', nace: 'DJ' },
        { no: 18, description: 'Machinery and equipment', usSic: '35', nace: 'DK' },
        { no: 19, description: 'Electrical and optical equipment', usSic: '36', nace: 'DL' },
        { no: 20, description: 'Shipbuilding', usSic: '37', nace: 'DM 35.1' },
        { no: 21, description: 'Aerospace', usSic: '37', nace: 'DM 35.3' },
        { no: 22, description: 'Other transport equipment', usSic: '37', nace: 'DM 34, 35.2,4,5' },
        { no: 23, description: 'Manufacturing not elsewhere classified', usSic: '39', nace: 'DN 36' },
        { no: 24, description: 'Recycling', usSic: '95', nace: 'DN 37' },
        { no: 25, description: 'Electricity Supply', usSic: '49', nace: 'E 40.1' },
        { no: 26, description: 'Gas Supply', usSic: '49', nace: 'E 40.2' },
        { no: 27, description: 'Water Supply', usSic: '49', nace: 'E 41, 40.3' },
        { no: 28, description: 'Construction', usSic: '15, 16, 17', nace: 'F' },
        { no: 29, description: 'Wholesale and retail trade', usSic: '50-59', nace: 'G' },
        { no: 30, description: 'Hotels and restaurants', usSic: '54, 70', nace: 'H' },
        { no: 31, description: 'Transport, storage and communication', usSic: '40-48', nace: 'I' },
        { no: 32, description: 'Financial intermediation; real estate; renting', usSic: '60-67', nace: 'J, K 70, K 71' },
        { no: 33, description: 'Information Technology', usSic: '35', nace: 'K 72' },
        { no: 34, description: 'Engineering services', usSic: '87', nace: 'K 73, 74.2' },
        { no: 35, description: 'Other Services', usSic: '72-89 minus 87', nace: 'K 74 MINUS K 74.2' },
        { no: 36, description: 'Public administration', usSic: '91-97', nace: 'L' },
        { no: 37, description: 'Education', usSic: '82', nace: 'M' },
        { no: 38, description: 'Health and social work', usSic: '94', nace: 'N' },
        { no: 39, description: 'Other social services', usSic: '-', nace: 'O' },
        { no: 40, description: 'Medical Devices, medical products', usSic: '-', nace: '-' }
    ];

    constructor(private opportunityService: OpportunityService) {}

    notifyChange(): void {
        this.opportunityChange.emit(this.opportunity);
    }
    selectIAF(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.opportunity.iafCategory = Number(target.value);
        this.notifyChange();
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
// Corrections pour proposal-form.component.ts

import { Component, OnInit, ElementRef, Renderer2, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf, CommonModule } from '@angular/common';
import { OpportunityService, AuditOpportunity } from '../../opportunity.service';
import { Subject, takeUntil, debounceTime } from 'rxjs';

export interface ProposalStage {
    criteria: string;
    auditFees: number;
    onsiteDays: number;
    offsiteDays: number;
    mandayPrice: number;
    reportingFees: number;
    schemeFees: number;
    certificateLicense: number;
    certificateCost: number;
    totalCertificates: number;
}

export interface ProposalInfo {
    paymentTerms: string;
    proposalNumber: string;
    proposalDate: string;
    clientProposal: string;
}

@Component({
    selector: 'app-proposal-form',
    standalone: true,
    templateUrl: './proposal-form.component.html',
    styleUrls: ['./proposal-form.component.css'],
    imports: [FormsModule, NgForOf, NgIf, CommonModule]
})
export class ProposalFormComponent implements OnInit, OnDestroy {
    @Input() opportunity: AuditOpportunity = {} as AuditOpportunity; // Type correct
    @Input() disabled: boolean = false;
    @Output() opportunityChange = new EventEmitter<AuditOpportunity>();
    @Output() validationChange = new EventEmitter<boolean>();

    showTable: boolean = false;
    isTableLocked: boolean = false;
    isSaving: boolean = false;
    hasUnsavedChanges: boolean = false;

    private destroy$ = new Subject<void>();
    private saveSubject = new Subject<void>();

    readonly defaultStages: ProposalStage[] = [
        {
            criteria: 'Stage 1',
            auditFees: 100.00,
            onsiteDays: 0.50,
            offsiteDays: 0.00,
            mandayPrice: 200.00,
            reportingFees: 0,
            schemeFees: 0,
            certificateLicense: 0.00,
            certificateCost: 0.00,
            totalCertificates: 1
        },
        {
            criteria: 'Stage 2',
            auditFees: 600.00,
            onsiteDays: 2.00,
            offsiteDays: 0.00,
            mandayPrice: 300.00,
            reportingFees: 0,
            schemeFees: 0,
            certificateLicense: 300.00,
            certificateCost: 150.00,
            totalCertificates: 1
        },
        {
            criteria: 'Re-Registration',
            auditFees: 600.00,
            onsiteDays: 2.00,
            offsiteDays: 0.00,
            mandayPrice: 300.00,
            reportingFees: 0,
            schemeFees: 0,
            certificateLicense: 300.00,
            certificateCost: 150.00,
            totalCertificates: 1
        },
        {
            criteria: 'S1',
            auditFees: 300.00,
            onsiteDays: 1.00,
            offsiteDays: 0.00,
            mandayPrice: 300.00,
            reportingFees: 0,
            schemeFees: 0,
            certificateLicense: 300.00,
            certificateCost: 0.00,
            totalCertificates: 1
        },
        {
            criteria: 'S2',
            auditFees: 300.00,
            onsiteDays: 1.00,
            offsiteDays: 0.00,
            mandayPrice: 300.00,
            reportingFees: 0,
            schemeFees: 0,
            certificateLicense: 300.00,
            certificateCost: 0.00,
            totalCertificates: 1
        },
        {
            criteria: 'Travel',
            auditFees: 150.00,
            onsiteDays: 0.00,
            offsiteDays: 0.00,
            mandayPrice: 0.00,
            reportingFees: 0,
            schemeFees: 0,
            certificateLicense: 0.00,
            certificateCost: 0.00,
            totalCertificates: 1
        }
    ];

    stages: ProposalStage[] = [...this.defaultStages];

    proposal: ProposalInfo = {
        paymentTerms: '',
        proposalNumber: '',
        proposalDate: '',
        clientProposal: ''
    };

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private opportunityService: OpportunityService
    ) {
        // Setup debounced auto-save
        this.saveSubject.pipe(
            debounceTime(1000), // Wait 1 second after last change
            takeUntil(this.destroy$)
        ).subscribe(() => {
            if (this.hasUnsavedChanges && !this.disabled) {
                this.saveProposalData();
            }
        });
    }

    ngOnInit(): void {
        this.initializeProposalData();
        this.updateFooterInfo();

        // Emit initial validation state
        setTimeout(() => {
            this.validationChange.emit(this.isFormValid());
        }, 100);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeProposalData(): void {
        if (!this.opportunity) {
            console.warn('No opportunity data provided');
            return;
        }

        // Load table state
        this.showTable = !!this.opportunity.proposalTableShown;
        this.isTableLocked = !!this.opportunity.proposalTableLocked;

        // Load proposal information - CORRECTION: Utiliser les bons champs
        this.proposal = {
            paymentTerms: this.opportunity.proposalPaymentTerms || '',
            proposalNumber: this.opportunity.proposalNumber || '',
            proposalDate: this.opportunity.proposalDate || '',
            clientProposal: this.opportunity.proposalClientProposal || ''
        };

        // Load stages data
        this.loadStagesData();
    }

    private loadStagesData(): void {
        if (this.opportunity.proposalStagesData) {
            try {
                const savedStages = JSON.parse(this.opportunity.proposalStagesData);
                if (this.isValidStagesData(savedStages)) {
                    this.stages = savedStages;
                } else {
                    console.warn('Invalid stages data structure, using defaults');
                    this.stages = [...this.defaultStages];
                }
            } catch (error) {
                console.error('Error parsing proposal stages data:', error);
                this.stages = [...this.defaultStages];
            }
        } else {
            this.stages = [...this.defaultStages];
        }
    }

    private isValidStagesData(stages: any): boolean {
        return Array.isArray(stages) &&
            stages.length > 0 &&
            stages.every(stage =>
                stage.criteria &&
                typeof stage.auditFees === 'number'
            );
    }

    showTableData(): void {
        if (this.disabled) {
            console.warn('Form is disabled - changes not allowed');
            return;
        }

        this.showTable = true;
        this.markAsChanged();
        this.scheduleAutoSave();

        // Calculate totals when table is shown
        setTimeout(() => {
            this.calculateAllTotals();
            // Emit validation state after showing table
            this.validationChange.emit(this.isFormValid());
        }, 100);
    }

    calculateRowTotal(stage: ProposalStage): number {
        const fields = [
            'auditFees', 'mandayPrice', 'reportingFees',
            'schemeFees', 'certificateLicense', 'certificateCost'
        ];

        return fields.reduce((total, field) => {
            const value = stage[field as keyof ProposalStage];
            return total + (typeof value === 'number' ? value : 0);
        }, 0);
    }

    calculateAllTotals(): void {
        // This method can be used for any additional calculations needed
        // Currently, totals are calculated on-demand in the template
    }

    calculateGrandTotal(): number {
        return this.stages.reduce((total, stage) => {
            return total + this.calculateRowTotal(stage);
        }, 0);
    }

    onInputChange(stage: ProposalStage, field: keyof ProposalStage, event: Event): void {
        if (this.disabled || this.isTableLocked) {
            console.warn('Form is disabled or table is locked - changes not allowed');
            return;
        }

        const input = event.target as HTMLInputElement;
        const value = parseFloat(input.value) || 0;

        // Type-safe assignment
        if (typeof stage[field] === 'number') {
            (stage[field] as number) = Math.max(0, value); // Ensure non-negative values
        }

        this.calculateAllTotals();
        this.markAsChanged();
        this.scheduleAutoSave();
    }

    lockTable(): void {
        if (this.disabled) {
            console.warn('Form is disabled - changes not allowed');
            return;
        }

        this.isTableLocked = true;
        this.markAsChanged();
        this.saveProposalData(); // Save immediately when locking

        // Visual feedback
        this.applyTableLockStyles();

        // Emit validation state after locking table
        this.validationChange.emit(this.isFormValid());
    }

    private applyTableLockStyles(): void {
        const table = this.el.nativeElement.querySelector('#proposalTable');
        if (table) {
            this.renderer.setStyle(table, 'opacity', '0.7');
            this.renderer.addClass(table, 'locked');
        }
    }

    // CORRECTION MAJEURE: Sauvegarder correctement les données
    saveProposalData(): void {
        if (this.disabled || this.isSaving || !this.hasUnsavedChanges) {
            return;
        }

        this.isSaving = true;

        // Mettre à jour l'opportunity avec les bonnes propriétés
        const updatedOpportunity: AuditOpportunity = {
            ...this.opportunity,
            proposalTableShown: this.showTable,
            proposalTableLocked: this.isTableLocked,
            proposalPaymentTerms: this.proposal.paymentTerms,
            proposalNumber: this.proposal.proposalNumber,
            proposalDate: this.proposal.proposalDate,
            proposalClientProposal: this.proposal.clientProposal,
            proposalStagesData: JSON.stringify(this.stages)
        };

        this.opportunityService.updateProposalJson(updatedOpportunity)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (savedOpportunity) => {
                    // Mettre à jour l'opportunity locale
                    Object.assign(this.opportunity, savedOpportunity);
                    this.hasUnsavedChanges = false;
                    this.notifyChange();
                    console.log('Proposal data saved successfully');
                },
                error: (error) => {
                    console.error('Error saving proposal data:', error);
                    // Could show user-friendly error message here
                },
                complete: () => {
                    this.isSaving = false;
                }
            });
    }

    saveProposalWithFile(): void {
        if (this.disabled || this.isSaving) {
            return;
        }

        if (!this.isFormValid()) {
            alert('Please complete all required fields before saving.');
            return;
        }

        this.isSaving = true;

        // Préparer les données avec le fichier
        const updatedOpportunity: AuditOpportunity = {
            ...this.opportunity,
            proposalTableShown: this.showTable,
            proposalTableLocked: this.isTableLocked,
            proposalPaymentTerms: this.proposal.paymentTerms,
            proposalNumber: this.proposal.proposalNumber,
            proposalDate: this.proposal.proposalDate,
            proposalClientProposal: this.proposal.clientProposal,
            proposalStagesData: JSON.stringify(this.stages)
        };

        this.opportunityService.updateProposal(updatedOpportunity)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (savedOpportunity) => {
                    Object.assign(this.opportunity, savedOpportunity);
                    this.hasUnsavedChanges = false;
                    this.notifyChange();
                    alert('Proposition sauvegardée avec succès !');
                },
                error: (error) => {
                    console.error('Error saving proposal with file:', error);
                    alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
                },
                complete: () => {
                    this.isSaving = false;
                }
            });
    }

    private markAsChanged(): void {
        this.hasUnsavedChanges = true;
        // Emit current validation state
        this.validationChange.emit(this.isFormValid());
    }

    private scheduleAutoSave(): void {
        this.saveSubject.next();
    }

    // CORRECTION MAJEURE: Notifier les changements correctement
    private notifyChange(): void {
        // Créer un objet avec toutes les données de proposal
        const notificationData = {
            ...this.opportunity,
            proposalTableShown: this.showTable,
            proposalTableLocked: this.isTableLocked,
            proposalPaymentTerms: this.proposal.paymentTerms,
            proposalNumber: this.proposal.proposalNumber,
            proposalDate: this.proposal.proposalDate,
            proposalClientProposal: this.proposal.clientProposal,
            proposalStagesData: JSON.stringify(this.stages),
            // Ajouter aussi la structure proposalInfo pour compatibilité
            proposalInfo: {
                paymentTerms: this.proposal.paymentTerms,
                proposalNumber: this.proposal.proposalNumber,
                proposalDate: this.proposal.proposalDate,
                clientProposal: this.proposal.clientProposal
            }
        };

        this.opportunityChange.emit(notificationData);
        this.validationChange.emit(this.isFormValid());
    }

    formatCurrency(amount: number): string {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return '0.00';
        }

        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    handleFileUpload(event: Event): void {
        if (this.disabled) {
            console.warn('Form is disabled - changes not allowed');
            return;
        }

        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (file) {
            // Validate file type
            const allowedTypes = ['.pdf', '.doc', '.docx'];
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

            if (!allowedTypes.includes(fileExtension)) {
                alert('Please select a valid file type (.pdf, .doc, .docx)');
                fileInput.value = '';
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size must be less than 10MB');
                fileInput.value = '';
                return;
            }

            this.opportunity.proposalFile = file;
            this.opportunity.proposalFileName = file.name;

            this.updateFileDisplayInfo(file.name);
            this.markAsChanged();

            console.log('File selected:', file.name);
        }
    }

    private updateFileDisplayInfo(fileName: string): void {
        const fileInfo = this.el.nativeElement.querySelector('.file-info') as HTMLElement;
        if (fileInfo) {
            fileInfo.textContent = fileName;
            this.renderer.setStyle(fileInfo, 'color', '#28a745');
            this.renderer.setStyle(fileInfo, 'fontWeight', 'bold');
        }
    }

    // CORRECTION: Validation basée sur les bonnes propriétés
    isFormValid(): boolean {
        return this.showTable &&
            this.isTableLocked &&
            this.proposal.paymentTerms.trim() !== '' &&
            this.proposal.proposalNumber.trim() !== '' &&
            this.proposal.proposalDate.trim() !== '' &&
            this.proposal.clientProposal.trim() !== '';
    }

    onProposalInfoChange(field: keyof ProposalInfo, event: Event): void {
        if (this.disabled) {
            console.warn('Form is disabled - changes not allowed');
            return;
        }

        const input = event.target as HTMLInputElement;
        this.proposal[field] = input.value;

        this.markAsChanged();
        this.scheduleAutoSave();

        // Emit validation state after info changes
        this.validationChange.emit(this.isFormValid());
    }

    private updateFooterInfo(): void {
        if (!this.proposal.proposalDate) {
            const today = new Date();
            this.proposal.proposalDate = today.toISOString().split('T')[0];
        }
    }

    trackByFn(index: number, item: ProposalStage): string {
        return item.criteria;
    }

    completeProposalStep(): void {
        if (!this.isFormValid()) {
            alert('Veuillez compléter tous les champs requis avant de terminer cette étape.');
            return;
        }

        // Save any pending changes first
        if (this.hasUnsavedChanges) {
            this.saveProposalData();
        }

        this.opportunityService.completeProposal(this.opportunity.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (completedOpportunity) => {
                    Object.assign(this.opportunity, completedOpportunity);
                    this.notifyChange();
                    alert('Étape Proposition terminée avec succès !');
                },
                error: (error) => {
                    console.error('Error completing proposal step:', error);
                    alert('Erreur lors de la finalisation de l\'étape.');
                }
            });
    }

    resetToDefaults(): void {
        if (this.disabled) return;

        this.stages = [...this.defaultStages];
        this.proposal = {
            paymentTerms: '',
            proposalNumber: '',
            proposalDate: new Date().toISOString().split('T')[0],
            clientProposal: ''
        };
        this.markAsChanged();
        this.scheduleAutoSave();
    }
}
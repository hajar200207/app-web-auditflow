//
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
//
// // Import form components
// import { OpportunityReviewFormComponent } from '../forms/opportunity-review-form/opportunity-review-form.component';
// import { PotentialApplicationFormComponent } from '../forms/potential-application-form/potential-application-form.component';
// import { ProposalFormComponent } from '../forms/proposal-form/proposal-form.component';
// import { NegotiationsFormComponent } from '../forms/negotiations-form/negotiations-form.component';
// import { ContractFormComponent } from '../forms/contract-form/contract-form.component';
// import {PipelineChatComponent} from "../pipeline-chat/pipeline-chat.component";
//
// @Component({
//   selector: 'app-pipeline-details',
//   templateUrl: './pipeline-details.component.html',
//   standalone: true,
//   styleUrls: ['./pipeline-details.component.css'],
//   imports: [
//     CommonModule,
//     FormsModule,
//     RouterLink,
//     OpportunityReviewFormComponent,
//     PotentialApplicationFormComponent,
//     ProposalFormComponent,
//     NegotiationsFormComponent,
//     ContractFormComponent,
//     PipelineChatComponent
//   ]
// })
// export class PipelineDetailsComponent implements OnInit {
//   steps = [
//     'Opportunity Review',
//     'Potential Application',
//     'Proposal',
//     'Negotiation',
//     'Contract'
//   ];
//
//   currentStep = 0;
//   maxStepReached = 0;
//   opportunity: any = {};
//   opportunityId: number = 0;
//   loading = true;
//
//   // Récupérer le rôle depuis localStorage
//   currentUserRole = localStorage.getItem('role') || '';
//
//   // Auto-save properties
//   private saveTimeout: any;
//   isSaving = false;
//   lastSaved: Date | null = null;
//
//   // Track form validation states
//   stepValidationStates: { [key: number]: boolean } = {
//     0: false,
//     1: false,
//     2: false,
//     3: false,
//     4: false
//   };
//
//   // Track step completion states (for locking)
//   stepCompletionStates: { [key: number]: boolean } = {
//     0: false,
//     1: false,
//     2: false,
//     3: false,
//     4: false
//   };
//
//   // Track who completed each step and when
//   stepCompletionMetadata: { [key: number]: { completedBy: string, completedAt: string } } = {};
//
//   constructor(
//       private route: ActivatedRoute,
//       private router: Router
//   ) {}
//
//   ngOnInit(): void {
//     // Get opportunity ID from route parameters
//     this.route.params.subscribe(params => {
//       this.opportunityId = +params['id'];
//       if (this.opportunityId) {
//         this.loadOpportunity();
//       }
//     });
//
//     // Get initial stage from query parameters
//     this.route.queryParams.subscribe(queryParams => {
//       if (queryParams['stage']) {
//         const stageIndex = this.getStepIndexFromStage(queryParams['stage']);
//         if (stageIndex !== -1) {
//           this.currentStep = stageIndex;
//           this.maxStepReached = Math.max(stageIndex, this.maxStepReached);
//         }
//       }
//     });
//   }
//
//   loadOpportunity(): void {
//     // Charger depuis localStorage au lieu du backend
//     const storageKey = `opportunity_${this.opportunityId}`;
//     const storedOpportunity = localStorage.getItem(storageKey);
//
//     if (storedOpportunity) {
//       this.opportunity = JSON.parse(storedOpportunity);
//     } else {
//       // Initialiser avec des données par défaut si pas trouvé
//       this.opportunity = this.getDefaultOpportunity();
//       this.saveOpportunityToStorage();
//     }
//
//     this.loading = false;
//
//     // Set current step based on opportunity stage
//     const stageIndex = this.getStepIndexFromStage(this.opportunity.stage || 'Opportunity Review');
//     if (stageIndex !== -1) {
//       this.currentStep = stageIndex;
//       this.maxStepReached = Math.max(stageIndex, this.maxStepReached);
//     }
//
//     // Initialize form validation and completion states
//     this.initializeStepStates();
//   }
//
//   getDefaultOpportunity(): any {
//     return {
//       id: this.opportunityId,
//       company: { name: 'Demo Company' },
//       opportunityName: 'Demo Opportunity',
//       standard: 'ISO 9001',
//       estimatedValue: 25000,
//       assignedAuditor: 'Demo Auditor',
//       stage: 'Opportunity Review',
//       status: 'In Progress',
//
//       // Step 0 fields
//       establishPrimaryContact: false,
//       identifyPainPoints: false,
//       determineBudget: false,
//       confirmTimeline: false,
//
//       // Step 1 fields
//       applicationSentDate: '',
//       fteNumber: '',
//       auditFrequency: '',
//       targetAuditDate: '',
//       mainLanguage: '',
//       riskLevel: '',
//       iafCategory: '',
//       scope: '',
//       scopeExclusions: '',
//
//       // Completion metadata
//       step0CompletedBy: null,
//       step0CompletedAt: null,
//       step1CompletedBy: null,
//       step1CompletedAt: null,
//       step2CompletedBy: null,
//       step2CompletedAt: null,
//       step3CompletedBy: null,
//       step3CompletedAt: null,
//       step4CompletedBy: null,
//       step4CompletedAt: null,
//
//       lastModified: new Date().toISOString(),
//       modifiedBy: this.getCurrentUser()
//     };
//   }
//
//   saveOpportunityToStorage(): void {
//     const storageKey = `opportunity_${this.opportunityId}`;
//     this.opportunity.lastModified = new Date().toISOString();
//     this.opportunity.modifiedBy = this.getCurrentUser();
//     localStorage.setItem(storageKey, JSON.stringify(this.opportunity));
//   }
//
//   getStepIndexFromStage(stage: string): number {
//     const stageToStepMap: { [key: string]: number } = {
//       'Opportunity Review': 0,
//       'Potential': 1,
//       'Proposal': 2,
//       'Negotiation': 3,
//       'Contract': 4
//     };
//     return stageToStepMap[stage] ?? -1;
//   }
//
//   getStageFromStepIndex(stepIndex: number): string {
//     const stepToStageMap: { [key: number]: string } = {
//       0: 'Opportunity Review',
//       1: 'Potential',
//       2: 'Proposal',
//       3: 'Negotiation',
//       4: 'Contract'
//     };
//     return stepToStageMap[stepIndex] ?? '';
//   }
//
//   initializeStepStates(): void {
//     // Step 0: Opportunity Review
//     const step0Valid = !!(
//         this.opportunity.establishPrimaryContact &&
//         this.opportunity.identifyPainPoints &&
//         this.opportunity.determineBudget &&
//         this.opportunity.confirmTimeline
//     );
//     this.stepValidationStates[0] = step0Valid;
//     this.stepCompletionStates[0] = step0Valid && !!this.opportunity.step0CompletedBy;
//
//     // Step 1: Potential Application
//     const step1Valid = !!(
//         this.opportunity.applicationSentDate &&
//         this.opportunity.fteNumber &&
//         this.opportunity.auditFrequency &&
//         this.opportunity.targetAuditDate &&
//         this.opportunity.mainLanguage &&
//         this.opportunity.riskLevel &&
//         this.opportunity.iafCategory
//     );
//     this.stepValidationStates[1] = step1Valid;
//     this.stepCompletionStates[1] = step1Valid && !!this.opportunity.step1CompletedBy;
//
//     // Initialize completion metadata
//     for (let i = 0; i < this.steps.length; i++) {
//       const completedBy = this.opportunity[`step${i}CompletedBy`];
//       const completedAt = this.opportunity[`step${i}CompletedAt`];
//       if (completedBy && completedAt) {
//         this.stepCompletionMetadata[i] = { completedBy, completedAt };
//       }
//     }
//
//     // Add validation for other steps as needed
//     for (let i = 2; i < this.steps.length; i++) {
//       this.stepValidationStates[i] = true; // Update this based on your form requirements
//       this.stepCompletionStates[i] = !!this.opportunity[`step${i}CompletedBy`];
//     }
//   }
//
//   goToStep(stepIndex: number): void {
//     if (stepIndex <= this.maxStepReached) {
//       this.currentStep = stepIndex;
//     }
//   }
//
//   nextStep() {
//     if (this.currentStep < this.steps.length - 1) {
//       // Mark current step as completed if it's valid and user is auditor
//       if (this.isStepValid() && this.isAuditor && !this.stepCompletionStates[this.currentStep]) {
//         this.markStepAsCompleted(this.currentStep);
//       }
//
//       this.currentStep++;
//       if (this.currentStep > this.maxStepReached) {
//         this.maxStepReached = this.currentStep;
//       }
//     }
//   }
//
//   markStepAsCompleted(stepIndex: number): void {
//     if (!this.isAuditor) return;
//
//     const currentUser = this.getCurrentUser();
//     const now = new Date().toISOString();
//
//     // Update opportunity data with completion info
//     this.opportunity[`step${stepIndex}CompletedBy`] = currentUser;
//     this.opportunity[`step${stepIndex}CompletedAt`] = now;
//
//     // Update local states
//     this.stepCompletionStates[stepIndex] = true;
//     this.stepCompletionMetadata[stepIndex] = {
//       completedBy: currentUser,
//       completedAt: now
//     };
//
//     // Save to localStorage instead of backend
//     this.saveStepCompletion(stepIndex);
//   }
//
//   saveStepCompletion(stepIndex: number): void {
//     try {
//       this.saveOpportunityToStorage();
//       console.log(`✅ Step ${stepIndex} marked as completed`);
//       this.showSaveIndicator(`✅ Étape ${stepIndex + 1} complétée et verrouillée`);
//     } catch (error) {
//       console.error('❌ Error saving step completion:', error);
//       this.showSaveIndicator('❌ Erreur de sauvegarde', true);
//       // Revert completion state on error
//       this.stepCompletionStates[stepIndex] = false;
//       delete this.stepCompletionMetadata[stepIndex];
//     }
//   }
//
//   isStepValid(): boolean {
//     return this.stepValidationStates[this.currentStep] || false;
//   }
//
//   isStepLocked(): boolean {
//     // Step is locked if it's completed and user is auditor
//     return this.isAuditor && this.stepCompletionStates[this.currentStep];
//   }
//
//   isStepCompleted(stepIndex: number): boolean {
//     return this.stepCompletionStates[stepIndex];
//   }
//
//   canEditStep(stepIndex: number): boolean {
//     // Admin can always edit, auditor can only edit if step is not completed
//     return this.isAdmin || !this.stepCompletionStates[stepIndex];
//   }
//
//   // Handle form changes with auto-save
//   onOpportunityChange(updatedOpportunity: any): void {
//     // Don't allow changes if step is locked
//     if (this.isStepLocked()) {
//       console.warn('Cannot modify completed step');
//       return;
//     }
//
//     this.opportunity = { ...this.opportunity, ...updatedOpportunity };
//     this.updateStepValidation();
//
//     // Trigger auto-save only for auditors on non-completed steps
//     if (this.isAuditor && !this.stepCompletionStates[this.currentStep]) {
//       this.triggerAutoSave();
//     }
//   }
//
//   // Auto-save avec debounce
//   triggerAutoSave(): void {
//     // Annuler la sauvegarde précédente si elle existe
//     if (this.saveTimeout) {
//       clearTimeout(this.saveTimeout);
//     }
//
//     // Programmer une nouvelle sauvegarde après 2 secondes
//     this.saveTimeout = setTimeout(() => {
//       this.autoSaveOpportunity();
//     }, 2000);
//   }
//
//   // Sauvegarde automatique dans localStorage
//   autoSaveOpportunity(): void {
//     this.isSaving = true;
//
//     try {
//       this.saveOpportunityToStorage();
//       this.isSaving = false;
//       this.lastSaved = new Date();
//       this.showSaveIndicator('✅ Sauvegardé automatiquement');
//       console.log('✅ Auto-save successful');
//     } catch (error) {
//       this.isSaving = false;
//       this.showSaveIndicator('❌ Erreur de sauvegarde', true);
//       console.error('❌ Auto-save failed:', error);
//     }
//   }
//
//   // Afficher indicateur de sauvegarde
//   showSaveIndicator(message: string, isError: boolean = false): void {
//     const indicator = document.createElement('div');
//     indicator.className = `save-indicator ${isError ? 'error' : 'success'}`;
//     indicator.innerHTML = message;
//     indicator.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       padding: 10px 15px;
//       border-radius: 5px;
//       color: white;
//       background: ${isError ? '#dc3545' : '#28a745'};
//       z-index: 1000;
//       font-size: 14px;
//       box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//       animation: slideIn 0.3s ease;
//     `;
//
//     document.body.appendChild(indicator);
//
//     setTimeout(() => {
//       indicator.style.animation = 'slideOut 0.3s ease';
//       setTimeout(() => indicator.remove(), 300);
//     }, 3000);
//   }
//
//   updateStepValidation(): void {
//     switch (this.currentStep) {
//       case 0: // Opportunity Review
//         this.stepValidationStates[0] = !!(
//             this.opportunity.establishPrimaryContact &&
//             this.opportunity.identifyPainPoints &&
//             this.opportunity.determineBudget &&
//             this.opportunity.confirmTimeline
//         );
//         break;
//       case 1: // Potential Application
//         this.stepValidationStates[1] = !!(
//             this.opportunity.applicationSentDate &&
//             this.opportunity.fteNumber &&
//             this.opportunity.auditFrequency &&
//             this.opportunity.targetAuditDate &&
//             this.opportunity.mainLanguage &&
//             this.opportunity.riskLevel &&
//             this.opportunity.iafCategory
//         );
//         break;
//       case 2: // Proposal (NEW)
//         this.stepValidationStates[2] = !!(
//             this.opportunity.proposalTableShown &&
//             this.opportunity.proposalTableLocked &&
//             this.opportunity.proposalInfo?.paymentTerms &&
//             this.opportunity.proposalInfo?.proposalNumber &&
//             this.opportunity.proposalInfo?.proposalDate &&
//             this.opportunity.proposalInfo?.clientProposal
//         );
//         break;
//       default:
//         this.stepValidationStates[this.currentStep] = true;
//         break;
//     }
//   }
//
//   // Sauvegarde manuelle pour l'admin ou quand nécessaire
//   saveCurrentStep(): void {
//     try {
//       this.saveOpportunityToStorage();
//       console.log('✅ Données sauvegardées manuellement');
//       this.showSaveIndicator('✅ Données sauvegardées');
//     } catch (error) {
//       console.error('❌ Erreur sauvegarde manuelle:', error);
//       this.showSaveIndicator('❌ Erreur de sauvegarde', true);
//     }
//   }
//
//   updateOpportunityStage(): void {
//     const newStage = this.getStageFromStepIndex(this.currentStep);
//     this.opportunity.stage = newStage;
//     this.opportunity.status = this.currentStep === this.steps.length - 1 ? 'Done' : 'In Progress';
//     this.saveOpportunityToStorage();
//     console.log('Stage updated successfully');
//   }
//
//   getCurrentUser(): string {
//     const user = localStorage.getItem('currentUser');
//     return user ? JSON.parse(user).username : localStorage.getItem('username') || 'Demo User';
//   }
//
//   goBackToPipeline(): void {
//     this.router.navigate(['/sales-pipeline']);
//   }
//
//   // Getters pour le rôle
//   get isAdmin(): boolean {
//     return this.currentUserRole === 'admin';
//   }
//
//   get isAuditor(): boolean {
//     return this.currentUserRole === 'auditor' || this.currentUserRole === 'auditeur';
//   }
//
//   // Méthodes pour l'affichage admin
//   getStepCompletionInfo(stepIndex: number): any {
//     const stepData = this.getStepData(stepIndex);
//     const isCompleted = this.stepCompletionStates[stepIndex];
//     const metadata = this.stepCompletionMetadata[stepIndex];
//
//     return {
//       isCompleted,
//       stepName: this.steps[stepIndex],
//       data: stepData,
//       completedAt: metadata?.completedAt || null,
//       completedBy: metadata?.completedBy || null
//     };
//   }
//
//   getStepData(stepIndex: number): any {
//     switch (stepIndex) {
//       case 0: // Opportunity Review
//         return {
//           'Contact Principal Établi': this.opportunity.establishPrimaryContact ? 'Oui' : 'Non',
//           'Points de Douleur Identifiés': this.opportunity.identifyPainPoints ? 'Oui' : 'Non',
//           'Budget Déterminé': this.opportunity.determineBudget ? 'Oui' : 'Non',
//           'Timeline Confirmée': this.opportunity.confirmTimeline ? 'Oui' : 'Non'
//         };
//       case 1: // Potential Application
//         return {
//           'Date Envoi Application': this.opportunity.applicationSentDate || 'Non renseigné',
//           'Nombre FTE': this.opportunity.fteNumber || 'Non renseigné',
//           'Fréquence Audits': this.opportunity.auditFrequency || 'Non renseigné',
//           'Date Audit Cible': this.opportunity.targetAuditDate || 'Non renseigné',
//           'Langue Principale': this.opportunity.mainLanguage || 'Non renseigné',
//           'Niveau de Risque': this.opportunity.riskLevel || 'Non renseigné',
//           'Catégorie IAF': this.opportunity.iafCategory || 'Non renseigné',
//           'Scope': this.opportunity.scope || 'Non renseigné',
//           'Exclusions Scope': this.opportunity.scopeExclusions || 'Non renseigné'
//         };
//       case 2: // Proposal (NEW)
//         return {
//           'Tableau Créé': this.opportunity.proposalTableShown ? 'Oui' : 'Non',
//           'Tableau Verrouillé': this.opportunity.proposalTableLocked ? 'Oui' : 'Non',
//           'Conditions de Paiement': this.opportunity.proposalInfo?.paymentTerms || 'Non renseigné',
//           'Numéro Proposition': this.opportunity.proposalInfo?.proposalNumber || 'Non renseigné',
//           'Date Proposition': this.opportunity.proposalInfo?.proposalDate || 'Non renseigné',
//           'Proposition Client': this.opportunity.proposalInfo?.clientProposal || 'Non renseigné',
//           'Fichier Uploadé': this.opportunity.proposalFileName || 'Non renseigné',
//           'Total Général': this.opportunity.proposalStages ? this.calculateProposalTotal() : 'Non calculé'
//         };
//
//       default:
//         return {};
//     }
//   }
//   calculateProposalTotal(): string {
//     if (!this.opportunity.proposalStages) return 'Non calculé';
//
//     const total = this.opportunity.proposalStages.reduce((sum: number, stage: any) => {
//       return sum + (stage.auditFees || 0) + (stage.mandayPrice || 0) +
//           (stage.reportingFees || 0) + (stage.schemeFees || 0) +
//           (stage.certificateLicense || 0) + (stage.certificateCost || 0);
//     }, 0);
//
//     return new Intl.NumberFormat('en-US', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     }).format(total) + ' USD';
//   }
//   // Formater la date pour l'affichage
//   formatDate(dateString: string): string {
//     if (!dateString) return 'Non disponible';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }
//
//   unlockStep(stepIndex: number): void {
//     if (!this.isAdmin) return;
//
//     this.stepCompletionStates[stepIndex] = false;
//     delete this.stepCompletionMetadata[stepIndex];
//     this.opportunity[`step${stepIndex}CompletedBy`] = null;
//     this.opportunity[`step${stepIndex}CompletedAt`] = null;
//
//     // Save changes
//     this.saveCurrentStep();
//     this.showSaveIndicator(`✅ Étape ${stepIndex + 1} déverrouillée`);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import form components
import { OpportunityReviewFormComponent } from '../forms/opportunity-review-form/opportunity-review-form.component';
import { PotentialApplicationFormComponent } from '../forms/potential-application-form/potential-application-form.component';
import { ProposalFormComponent } from '../forms/proposal-form/proposal-form.component';
import { NegotiationsFormComponent } from '../forms/negotiations-form/negotiations-form.component';
import { ContractFormComponent } from '../forms/contract-form/contract-form.component';
import {PipelineChatComponent} from "../pipeline-chat/pipeline-chat.component";

@Component({
  selector: 'app-pipeline-details',
  templateUrl: './pipeline-details.component.html',
  standalone: true,
  styleUrls: ['./pipeline-details.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    OpportunityReviewFormComponent,
    PotentialApplicationFormComponent,
    ProposalFormComponent,
    NegotiationsFormComponent,
    ContractFormComponent,
    PipelineChatComponent
  ]
})
export class PipelineDetailsComponent implements OnInit {
  steps = [
    'Opportunity Review',
    'Potential Application',
    'Proposal',
    'Negotiation',
    'Contract'
  ];

  currentStep = 0;
  maxStepReached = 0;
  opportunity: any = {};
  opportunityId: number = 0;
  loading = true;

  // Récupérer le rôle depuis localStorage
  currentUserRole = localStorage.getItem('role') || '';

  // Auto-save properties
  private saveTimeout: any;
  isSaving = false;
  lastSaved: Date | null = null;

  // Track form validation states
  stepValidationStates: { [key: number]: boolean } = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  };

  // Track step completion states (for locking)
  stepCompletionStates: { [key: number]: boolean } = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  };

  // Track who completed each step and when
  stepCompletionMetadata: { [key: number]: { completedBy: string, completedAt: string } } = {};

  constructor(
      private route: ActivatedRoute,
      private router: Router
  ) {}

  ngOnInit(): void {
    // Get opportunity ID from route parameters
    this.route.params.subscribe(params => {
      this.opportunityId = +params['id'];
      if (this.opportunityId) {
        this.loadOpportunity();
      }
    });

    // Get initial stage from query parameters
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['stage']) {
        const stageIndex = this.getStepIndexFromStage(queryParams['stage']);
        if (stageIndex !== -1) {
          this.currentStep = stageIndex;
          this.maxStepReached = Math.max(stageIndex, this.maxStepReached);
        }
      }
    });
  }

  loadOpportunity(): void {
    // Charger depuis localStorage au lieu du backend
    const storageKey = `opportunity_${this.opportunityId}`;
    const storedOpportunity = localStorage.getItem(storageKey);

    if (storedOpportunity) {
      this.opportunity = JSON.parse(storedOpportunity);
    } else {
      // Initialiser avec des données par défaut si pas trouvé
      this.opportunity = this.getDefaultOpportunity();
      this.saveOpportunityToStorage();
    }

    this.loading = false;

    // Set current step based on opportunity stage
    const stageIndex = this.getStepIndexFromStage(this.opportunity.stage || 'Opportunity Review');
    if (stageIndex !== -1) {
      this.currentStep = stageIndex;
      this.maxStepReached = Math.max(stageIndex, this.maxStepReached);
    }

    // Initialize form validation and completion states
    this.initializeStepStates();
  }

  getDefaultOpportunity(): any {
    return {
      id: this.opportunityId,
      company: { name: 'Demo Company' },
      opportunityName: 'Demo Opportunity',
      standard: 'ISO 9001',
      estimatedValue: 25000,
      assignedAuditor: 'Demo Auditor',
      stage: 'Opportunity Review',
      status: 'In Progress',

      // Step 0 fields
      establishPrimaryContact: false,
      identifyPainPoints: false,
      determineBudget: false,
      confirmTimeline: false,

      // Step 1 fields
      applicationSentDate: '',
      fteNumber: '',
      auditFrequency: '',
      targetAuditDate: '',
      mainLanguage: '',
      riskLevel: '',
      iafCategory: '',
      scope: '',
      scopeExclusions: '',

      // Step 2 fields (Proposal)
      proposalTableShown: false,
      proposalTableLocked: false,
      proposalStages: [],
      proposalInfo: {
        paymentTerms: '',
        proposalNumber: '',
        proposalDate: '',
        clientProposal: ''
      },
      proposalFileName: '',

      // Step 3 fields (Negotiation)
      negotiationData: {

        clientDecisionDate: '',

      },

      // Completion metadata
      step0CompletedBy: null,
      step0CompletedAt: null,
      step1CompletedBy: null,
      step1CompletedAt: null,
      step2CompletedBy: null,
      step2CompletedAt: null,
      step3CompletedBy: null,
      step3CompletedAt: null,
      step4CompletedBy: null,
      step4CompletedAt: null,

      lastModified: new Date().toISOString(),
      modifiedBy: this.getCurrentUser()
    };
  }

  saveOpportunityToStorage(): void {
    const storageKey = `opportunity_${this.opportunityId}`;
    this.opportunity.lastModified = new Date().toISOString();
    this.opportunity.modifiedBy = this.getCurrentUser();
    localStorage.setItem(storageKey, JSON.stringify(this.opportunity));
  }

  getStepIndexFromStage(stage: string): number {
    const stageToStepMap: { [key: string]: number } = {
      'Opportunity Review': 0,
      'Potential': 1,
      'Proposal': 2,
      'Negotiation': 3,
      'Contract': 4
    };
    return stageToStepMap[stage] ?? -1;
  }

  getStageFromStepIndex(stepIndex: number): string {
    const stepToStageMap: { [key: number]: string } = {
      0: 'Opportunity Review',
      1: 'Potential',
      2: 'Proposal',
      3: 'Negotiation',
      4: 'Contract'
    };
    return stepToStageMap[stepIndex] ?? '';
  }

  // Dans la méthode initializeStepStates, modifier la validation du step 3:
  initializeStepStates(): void {
    // Step 0: Opportunity Review
    const step0Valid = !!(
        this.opportunity.establishPrimaryContact &&
        this.opportunity.identifyPainPoints &&
        this.opportunity.determineBudget &&
        this.opportunity.confirmTimeline
    );
    this.stepValidationStates[0] = step0Valid;
    this.stepCompletionStates[0] = step0Valid && !!this.opportunity.step0CompletedBy;

    // Step 1: Potential Application
    const step1Valid = !!(
        this.opportunity.applicationSentDate &&
        this.opportunity.fteNumber &&
        this.opportunity.auditFrequency &&
        this.opportunity.targetAuditDate &&
        this.opportunity.mainLanguage &&
        this.opportunity.riskLevel &&
        this.opportunity.iafCategory
    );
    this.stepValidationStates[1] = step1Valid;
    this.stepCompletionStates[1] = step1Valid && !!this.opportunity.step1CompletedBy;

    // Step 2: Proposal validation
    const step2Valid = !!(
        this.opportunity.proposalTableShown &&
        this.opportunity.proposalTableLocked &&
        this.opportunity.proposalInfo?.paymentTerms &&
        this.opportunity.proposalInfo?.proposalNumber &&
        this.opportunity.proposalInfo?.proposalDate &&
        this.opportunity.proposalInfo?.clientProposal
    );
    this.stepValidationStates[2] = step2Valid;
    this.stepCompletionStates[2] = step2Valid && !!this.opportunity.step2CompletedBy;

    // Step 3: Negotiation validation - MODIFIÉ: seulement clientDecisionDate requis
    const step3Valid = !!(
        this.opportunity.negotiationData?.clientDecisionDate &&
        this.opportunity.negotiationData?.clientFinalDecision
    );
    this.stepValidationStates[3] = step3Valid;
    this.stepCompletionStates[3] = step3Valid && !!this.opportunity.step3CompletedBy;

    // Initialize completion metadata
    for (let i = 0; i < this.steps.length; i++) {
      const completedBy = this.opportunity[`step${i}CompletedBy`];
      const completedAt = this.opportunity[`step${i}CompletedAt`];
      if (completedBy && completedAt) {
        this.stepCompletionMetadata[i] = { completedBy, completedAt };
      }
    }

    // Add validation for step 4 (Contract)
    this.stepValidationStates[4] = true; // Update this based on your contract form requirements
    this.stepCompletionStates[4] = !!this.opportunity.step4CompletedBy;
  }

  goToStep(stepIndex: number): void {
    if (stepIndex <= this.maxStepReached) {
      this.currentStep = stepIndex;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      // Mark current step as completed if it's valid and user is auditor
      if (this.isStepValid() && this.isAuditor && !this.stepCompletionStates[this.currentStep]) {
        this.markStepAsCompleted(this.currentStep);
      }

      this.currentStep++;
      if (this.currentStep > this.maxStepReached) {
        this.maxStepReached = this.currentStep;
      }
    }
  }

  markStepAsCompleted(stepIndex: number): void {
    if (!this.isAuditor) return;

    const currentUser = this.getCurrentUser();
    const now = new Date().toISOString();

    // Update opportunity data with completion info
    this.opportunity[`step${stepIndex}CompletedBy`] = currentUser;
    this.opportunity[`step${stepIndex}CompletedAt`] = now;

    // Update local states
    this.stepCompletionStates[stepIndex] = true;
    this.stepCompletionMetadata[stepIndex] = {
      completedBy: currentUser,
      completedAt: now
    };

    // Save to localStorage instead of backend
    this.saveStepCompletion(stepIndex);
  }

  saveStepCompletion(stepIndex: number): void {
    try {
      this.saveOpportunityToStorage();
      console.log(`✅ Step ${stepIndex} marked as completed`);
      this.showSaveIndicator(`✅ Étape ${stepIndex + 1} complétée et verrouillée`);
    } catch (error) {
      console.error('❌ Error saving step completion:', error);
      this.showSaveIndicator('❌ Erreur de sauvegarde', true);
      // Revert completion state on error
      this.stepCompletionStates[stepIndex] = false;
      delete this.stepCompletionMetadata[stepIndex];
    }
  }

  isStepValid(): boolean {
    return this.stepValidationStates[this.currentStep] || false;
  }

  isStepLocked(): boolean {
    // Step is locked if it's completed and user is auditor
    return this.isAuditor && this.stepCompletionStates[this.currentStep];
  }

  isStepCompleted(stepIndex: number): boolean {
    return this.stepCompletionStates[stepIndex];
  }

  canEditStep(stepIndex: number): boolean {
    // Admin can always edit, auditor can only edit if step is not completed
    return this.isAdmin || !this.stepCompletionStates[stepIndex];
  }

  // Handle form changes with auto-save
  // Dans pipeline-details.component.ts, corriger la méthode onOpportunityChange :

  onOpportunityChange(updatedOpportunity: any): void {
    // Don't allow changes if step is locked
    if (this.isStepLocked()) {
      console.warn('Cannot modify completed step');
      return;
    }

    // Merge the new data with existing opportunity
    this.opportunity = { ...this.opportunity, ...updatedOpportunity };

    if (this.currentStep === 2 && updatedOpportunity.proposalInfo) {
      // Map proposal data to expected fields
      this.opportunity.proposalPaymentTerms = updatedOpportunity.proposalInfo.paymentTerms;
      this.opportunity.proposalNumber = updatedOpportunity.proposalInfo.proposalNumber;
      this.opportunity.proposalDate = updatedOpportunity.proposalInfo.proposalDate;
      this.opportunity.proposalClientProposal = updatedOpportunity.proposalInfo.clientProposal;
    }

    // CRITICAL FIX: Always update validation after data changes
    this.updateStepValidation();

    console.log('Opportunity changed:', {
      step: this.currentStep,
      isValid: this.stepValidationStates[this.currentStep],
      opportunityData: this.opportunity
    });

    // Trigger auto-save only for auditors on non-completed steps
    if (this.isAuditor && !this.stepCompletionStates[this.currentStep]) {
      this.triggerAutoSave();
    }
  }


  // Auto-save avec debounce
  triggerAutoSave(): void {
    // Annuler la sauvegarde précédente si elle existe
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Programmer une nouvelle sauvegarde après 2 secondes
    this.saveTimeout = setTimeout(() => {
      this.autoSaveOpportunity();
    }, 2000);
  }

  // Sauvegarde automatique dans localStorage
  autoSaveOpportunity(): void {
    this.isSaving = true;

    try {
      this.saveOpportunityToStorage();
      this.isSaving = false;
      this.lastSaved = new Date();
      this.showSaveIndicator('✅ Sauvegardé automatiquement');
      console.log('✅ Auto-save successful');
    } catch (error) {
      this.isSaving = false;
      this.showSaveIndicator('❌ Erreur de sauvegarde', true);
      console.error('❌ Auto-save failed:', error);
    }
  }

  // Afficher indicateur de sauvegarde
  showSaveIndicator(message: string, isError: boolean = false): void {
    const indicator = document.createElement('div');
    indicator.className = `save-indicator ${isError ? 'error' : 'success'}`;
    indicator.innerHTML = message;
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 15px;
      border-radius: 5px;
      color: white;
      background: ${isError ? '#dc3545' : '#28a745'};
      z-index: 1000;
      font-size: 14px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(indicator);

    setTimeout(() => {
      indicator.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => indicator.remove(), 300);
    }, 3000);
  }

  // Dans la méthode updateStepValidation, modifier le case 3:
  // Dans pipeline-details.component.ts, modifier la méthode updateStepValidation :

  updateStepValidation(): void {
    switch (this.currentStep) {
      case 0: // Opportunity Review
        this.stepValidationStates[0] = !!(
            this.opportunity.establishPrimaryContact &&
            this.opportunity.identifyPainPoints &&
            this.opportunity.determineBudget &&
            this.opportunity.confirmTimeline
        );
        break;
      case 1: // Potential Application
        this.stepValidationStates[1] = !!(
            this.opportunity.applicationSentDate &&
            this.opportunity.fteNumber &&
            this.opportunity.auditFrequency &&
            this.opportunity.targetAuditDate &&
            this.opportunity.mainLanguage &&
            this.opportunity.riskLevel &&
            this.opportunity.iafCategory
        );
        break;
      case 2: // Proposal
        this.stepValidationStates[2] = !!(
            this.opportunity.proposalTableShown &&
            this.opportunity.proposalTableLocked &&
            this.opportunity.proposalInfo?.paymentTerms &&
            this.opportunity.proposalInfo?.proposalNumber &&
            this.opportunity.proposalInfo?.proposalDate &&
            this.opportunity.proposalInfo?.clientProposal
        );
        break;
      case 3: // Negotiation - FIXED VALIDATION
        // Check both possible data locations for flexibility
        const negotiationValid = !!(
            (this.opportunity.negotiationData?.clientDecisionDate && this.opportunity.negotiationData?.clientFinalDecision) ||
            (this.opportunity.clientDecisionDate && this.opportunity.clientFinalDecision)
        );
        this.stepValidationStates[3] = negotiationValid;
        console.log('Step 3 validation:', {
          negotiationData: this.opportunity.negotiationData,
          clientDecisionDate: this.opportunity.clientDecisionDate,
          clientFinalDecision: this.opportunity.clientFinalDecision,
          isValid: negotiationValid
        });
        break;
      default:
        this.stepValidationStates[this.currentStep] = true;
        break;
    }
  }
  // Sauvegarde manuelle pour l'admin ou quand nécessaire
  saveCurrentStep(): void {
    try {
      this.saveOpportunityToStorage();
      console.log('✅ Données sauvegardées manuellement');
      this.showSaveIndicator('✅ Données sauvegardées');
    } catch (error) {
      console.error('❌ Erreur sauvegarde manuelle:', error);
      this.showSaveIndicator('❌ Erreur de sauvegarde', true);
    }
  }

  updateOpportunityStage(): void {
    const newStage = this.getStageFromStepIndex(this.currentStep);
    this.opportunity.stage = newStage;
    this.opportunity.status = this.currentStep === this.steps.length - 1 ? 'Done' : 'In Progress';
    this.saveOpportunityToStorage();
    console.log('Stage updated successfully');
  }

  getCurrentUser(): string {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).username : localStorage.getItem('username') || 'Demo User';
  }

  goBackToPipeline(): void {
    this.router.navigate(['/sales-pipeline']);
  }

  // Getters pour le rôle
  get isAdmin(): boolean {
    return this.currentUserRole === 'admin';
  }

  get isAuditor(): boolean {
    return this.currentUserRole === 'auditor' || this.currentUserRole === 'auditeur';
  }

  // Méthodes pour l'affichage admin
  getStepCompletionInfo(stepIndex: number): any {
    const stepData = this.getStepData(stepIndex);
    const isCompleted = this.stepCompletionStates[stepIndex];
    const metadata = this.stepCompletionMetadata[stepIndex];

    return {
      isCompleted,
      stepName: this.steps[stepIndex],
      data: stepData,
      completedAt: metadata?.completedAt || null,
      completedBy: metadata?.completedBy || null
    };
  }

  getStepData(stepIndex: number): any {
    switch (stepIndex) {
      case 0: // Opportunity Review
        return {
          'Contact Principal Établi': this.opportunity.establishPrimaryContact ? 'Oui' : 'Non',
          'Points de Douleur Identifiés': this.opportunity.identifyPainPoints ? 'Oui' : 'Non',
          'Budget Déterminé': this.opportunity.determineBudget ? 'Oui' : 'Non',
          'Timeline Confirmée': this.opportunity.confirmTimeline ? 'Oui' : 'Non'
        };
      case 1: // Potential Application
        return {
          'Date Envoi Application': this.opportunity.applicationSentDate || 'Non renseigné',
          'Nombre FTE': this.opportunity.fteNumber || 'Non renseigné',
          'Fréquence Audits': this.opportunity.auditFrequency || 'Non renseigné',
          'Date Audit Cible': this.opportunity.targetAuditDate || 'Non renseigné',
          'Langue Principale': this.opportunity.mainLanguage || 'Non renseigné',
          'Niveau de Risque': this.opportunity.riskLevel || 'Non renseigné',
          'Catégorie IAF': this.opportunity.iafCategory || 'Non renseigné',
          'Scope': this.opportunity.scope || 'Non renseigné',
          'Exclusions Scope': this.opportunity.scopeExclusions || 'Non renseigné'
        };
      case 2: // Proposal (NEW)
        return {
          'Tableau Créé': this.opportunity.proposalTableShown ? 'Oui' : 'Non',
          'Tableau Verrouillé': this.opportunity.proposalTableLocked ? 'Oui' : 'Non',
          'Conditions de Paiement': this.opportunity.proposalInfo?.paymentTerms || 'Non renseigné',
          'Numéro Proposition': this.opportunity.proposalInfo?.proposalNumber || 'Non renseigné',
          'Date Proposition': this.opportunity.proposalInfo?.proposalDate || 'Non renseigné',
          'Proposition Client': this.opportunity.proposalInfo?.clientProposal || 'Non renseigné',
          'Fichier Uploadé': this.opportunity.proposalFileName || 'Non renseigné',
          'Total Général': this.opportunity.proposalStages ? this.calculateProposalTotal() : 'Non calculé'
        };
      case 3: // Negotiation
        return {

          'Client Decision Date': this.opportunity.negotiationData?.clientDecisionDate || 'Non renseigné'

        };
      default:
        return {};
    }
  }

  calculateProposalTotal(): string {
    if (!this.opportunity.proposalStages) return 'Non calculé';

    const total = this.opportunity.proposalStages.reduce((sum: number, stage: any) => {
      return sum + (stage.auditFees || 0) + (stage.mandayPrice || 0) +
          (stage.reportingFees || 0) + (stage.schemeFees || 0) +
          (stage.certificateLicense || 0) + (stage.certificateCost || 0);
    }, 0);

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total) + ' USD';
  }

  // Formater la date pour l'affichage
  formatDate(dateString: string): string {
    if (!dateString) return 'Non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  unlockStep(stepIndex: number): void {
    if (!this.isAdmin) return;

    this.stepCompletionStates[stepIndex] = false;
    delete this.stepCompletionMetadata[stepIndex];
    this.opportunity[`step${stepIndex}CompletedBy`] = null;
    this.opportunity[`step${stepIndex}CompletedAt`] = null;

    // Save changes
    this.saveCurrentStep();
    this.showSaveIndicator(`✅ Étape ${stepIndex + 1} déverrouillée`);
  }
  onStepValidationChange(stepIndex: number, isValid: boolean): void {
    console.log(`Step ${stepIndex} validation changed:`, isValid);

    // Update the validation state for the specific step
    this.stepValidationStates[stepIndex] = isValid;

    // If this is the current step, trigger any additional validation logic
    if (stepIndex === this.currentStep) {
      this.updateStepValidation();
    }
  }
}
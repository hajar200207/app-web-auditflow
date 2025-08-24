// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgForOf, NgIf } from '@angular/common';
// import { RouterLink } from '@angular/router';
//
// // IMPORTS DES FORM COMPONENTS
// import { OpportunityReviewFormComponent } from '../forms/opportunity-review-form/opportunity-review-form.component';
// import { PotentialApplicationFormComponent } from '../forms/potential-application-form/potential-application-form.component';
// import { ProposalFormComponent } from '../forms/proposal-form/proposal-form.component';
// import { NegotiationsFormComponent } from '../forms/negotiations-form/negotiations-form.component';
// import { ContractFormComponent } from '../forms/contract-form/contract-form.component';
// import {Component, OnInit} from "@angular/core";
// import {HttpClient, HttpHeaders} from "@angular/common/http";
//
// @Component({
//   selector: 'app-sales-pipeline',
//   templateUrl: './sales-pipeline.component.html',
//   standalone: true,
//   styleUrls: ['./sales-pipeline.component.css'],
//   imports: [
//     CommonModule,
//     FormsModule,
//     NgIf,
//     NgForOf,
//     RouterLink,
//     OpportunityReviewFormComponent,
//     PotentialApplicationFormComponent,
//     ProposalFormComponent,
//     NegotiationsFormComponent,
//     ContractFormComponent
//   ]
// })
// export class SalesPipelineComponent implements OnInit {
//   stages = [
//     { key: 'Opportunity Review', label: 'Opportunity Review', number: '1' },
//     { key: 'Potential', label: 'Potential', number: '2' },
//     { key: 'Proposal', label: 'Proposal', number: '3' },
//     { key: 'Negotiation', label: 'Negotiation', number: '4' },
//     { key: 'Contract', label: 'Contract', number: '5' }
//   ];
//
//   opportunitiesByStage: { [key: string]: any[] } = {};
//   role = localStorage.getItem('role') || '';
//   opportunity: any = {}; // or initialize with real data later
//
//   constructor(private http: HttpClient) {}
//
//   ngOnInit(): void {
//     this.fetchOpportunities();
//   }
//
//   fetchOpportunities() {
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//
//     this.http.get<any[]>('http://localhost:8080/api/opportunities', { headers }).subscribe({
//       next: data => {
//         data.forEach(opp => {
//           opp.newStage = opp.stage;
//           opp.newStatus = opp.status;
//         });
//         this.organizeByStage(data);
//       },
//       error: err => console.error('Failed to load opportunities:', err)
//     });
//   }
//
//   organizeByStage(opps: any[]) {
//     this.stages.forEach(stage => {
//       this.opportunitiesByStage[stage.key] = opps.filter(opp => opp.stage === stage.key);
//     });
//   }
//
//   getOpportunitiesByStage(stage: string) {
//     return this.opportunitiesByStage[stage] || [];
//   }
//
//   updateStage(opportunityId: number, newStage: string, newStatus: string) {
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//
//     this.http.put(`http://localhost:8080/api/opportunities/${opportunityId}/stage`, {
//       stage: newStage,
//       status: newStatus
//     }, { headers }).subscribe({
//       next: () => this.fetchOpportunities(),
//       error: err => console.error('Error updating stage:', err)
//     });
//   }
// }
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

// IMPORTS DES FORM COMPONENTS
import { OpportunityReviewFormComponent } from '../forms/opportunity-review-form/opportunity-review-form.component';
import { PotentialApplicationFormComponent } from '../forms/potential-application-form/potential-application-form.component';
import { ProposalFormComponent } from '../forms/proposal-form/proposal-form.component';
import { NegotiationsFormComponent } from '../forms/negotiations-form/negotiations-form.component';
import { ContractFormComponent } from '../forms/contract-form/contract-form.component';

@Component({
  selector: 'app-sales-pipeline',
  templateUrl: './sales-pipeline.component.html',
  standalone: true,
  styleUrls: ['./sales-pipeline.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgForOf,
    RouterLink,
  ]
})
export class SalesPipelineComponent implements OnInit {
  stages = [
    { key: 'Opportunity Review', label: 'Opportunity Review', number: '1' },
    { key: 'Potential', label: 'Potential', number: '2' },
    { key: 'Proposal', label: 'Proposal', number: '3' },
    { key: 'Negotiation', label: 'Negotiation', number: '4' },
    { key: 'Contract', label: 'Contract', number: '5' }
  ];

  opportunitiesByStage: { [key: string]: any[] } = {};
  role = localStorage.getItem('role') || '';
  opportunity: any = {};

  // Nouvelles propriétés pour l'admin
  selectedOpportunity: any = null;
  showProgressModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOpportunities();
  }

  fetchOpportunities() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:8080/api/opportunities', { headers }).subscribe({
      next: data => {
        data.forEach(opp => {
          opp.newStage = opp.stage;
          opp.newStatus = opp.status;
        });
        this.organizeByStage(data);
      },
      error: err => console.error('Failed to load opportunities:', err)
    });
  }

  organizeByStage(opps: any[]) {
    this.stages.forEach(stage => {
      this.opportunitiesByStage[stage.key] = opps.filter(opp => opp.stage === stage.key);
    });
  }

  getOpportunitiesByStage(stage: string) {
    return this.opportunitiesByStage[stage] || [];
  }

  updateStage(opportunityId: number, newStage: string, newStatus: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(`http://localhost:8080/api/opportunities/${opportunityId}/stage`, {
      stage: newStage,
      status: newStatus
    }, { headers }).subscribe({
      next: () => this.fetchOpportunities(),
      error: err => console.error('Error updating stage:', err)
    });
  }

  // NOUVELLES MÉTHODES POUR ADMIN

  // Vérifier si l'utilisateur est admin
  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  // Obtenir le statut de complétion d'une opportunité
  getCompletionStatus(opportunity: any): string {
    if (!opportunity.lastModified) {
      return 'Non commencé';
    }

    const completedSteps = this.getCompletedStepsCount(opportunity);
    const totalSteps = this.stages.length;

    if (completedSteps === totalSteps) {
      return 'Complété';
    } else if (completedSteps > 0) {
      return `En cours (${completedSteps}/${totalSteps})`;
    } else {
      return 'Non commencé';
    }
  }

  // Compter le nombre d'étapes complétées
  getCompletedStepsCount(opportunity: any): number {
    let completedCount = 0;

    // Vérifier chaque étape
    if (this.isStepCompleted(opportunity, 'Opportunity Review')) completedCount++;
    if (this.isStepCompleted(opportunity, 'Potential')) completedCount++;
    if (this.isStepCompleted(opportunity, 'Proposal')) completedCount++;
    if (this.isStepCompleted(opportunity, 'Negotiation')) completedCount++;
    if (this.isStepCompleted(opportunity, 'Contract')) completedCount++;

    return completedCount;
  }

  // Vérifier si une étape est complétée
  isStepCompleted(opportunity: any, stepKey: string): boolean {
    switch (stepKey) {
      case 'Opportunity Review':
        return !!(
            opportunity.establishPrimaryContact &&
            opportunity.identifyPainPoints &&
            opportunity.determineBudget &&
            opportunity.confirmTimeline
        );
      case 'Potential':
        return !!(
            opportunity.applicationSentDate &&
            opportunity.fteNumber &&
            opportunity.auditFrequency &&
            opportunity.targetAuditDate &&
            opportunity.mainLanguage &&
            opportunity.riskLevel &&
            opportunity.iafCategory
        );
      case 'Proposal':
      case 'Negotiation':
      case 'Contract':
        // À implémenter selon vos critères
        return false;
      default:
        return false;
    }
  }

  // Afficher les détails de progression pour l'admin
  viewOpportunityProgress(opportunity: any): void {
    if (!this.isAdmin) return;

    this.selectedOpportunity = opportunity;
    this.showProgressModal = true;

    // Charger les détails complets de l'opportunité
    this.loadOpportunityDetails(opportunity.id);
  }

  // Charger les détails complets d'une opportunité
  loadOpportunityDetails(opportunityId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`http://localhost:8080/api/opportunities/${opportunityId}`, { headers })
        .subscribe({
          next: (data: any) => {
            this.selectedOpportunity = data;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des détails:', error);
          }
        });
  }

  // Fermer le modal de progression
  closeProgressModal(): void {
    this.showProgressModal = false;
    this.selectedOpportunity = null;
  }

  // Obtenir la classe CSS pour le statut
  getStatusClass(opportunity: any): string {
    const status = this.getCompletionStatus(opportunity);
    switch (status) {
      case 'Complété':
        return 'status-completed';
      case 'Non commencé':
        return 'status-not-started';
      default:
        return 'status-in-progress';
    }
  }

  // Formater la date de dernière modification
  formatLastModified(dateString: string): string {
    if (!dateString) return 'Jamais modifié';

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtenir les détails d'une étape spécifique
  getStepDetails(opportunity: any, stepKey: string): any {
    switch (stepKey) {
      case 'Opportunity Review':
        return {
          establishPrimaryContact: opportunity.establishPrimaryContact || false,
          identifyPainPoints: opportunity.identifyPainPoints || false,
          determineBudget: opportunity.determineBudget || false,
          confirmTimeline: opportunity.confirmTimeline || false
        };
      case 'Potential':
        return {
          applicationSentDate: opportunity.applicationSentDate || '',
          fteNumber: opportunity.fteNumber || '',
          auditFrequency: opportunity.auditFrequency || '',
          targetAuditDate: opportunity.targetAuditDate || '',
          mainLanguage: opportunity.mainLanguage || '',
          riskLevel: opportunity.riskLevel || '',
          iafCategory: opportunity.iafCategory || '',
          scope: opportunity.scope || '',
          scopeExclusions: opportunity.scopeExclusions || ''
        };
      default:
        return {};
    }
  }

  // Calculer le pourcentage de progression
  getProgressPercentage(opportunity: any): number {
    const completedSteps = this.getCompletedStepsCount(opportunity);
    const totalSteps = this.stages.length;
    return Math.round((completedSteps / totalSteps) * 100);
  }
}
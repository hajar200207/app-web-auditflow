import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityService } from '../../opportunity.service'; // Adjust path as needed

@Component({
  selector: 'app-negotiation-form',
  templateUrl: './negotiations-form.component.html',
  styleUrls: ['./negotiations-form.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NegotiationsFormComponent implements OnInit {
  @Input() opportunity: any;
  @Output() opportunityChange = new EventEmitter<unknown>();
  @Input() disabled!: boolean;

  // Checkbox states
  checkboxStates: any = {
    competitorsDefined: false,
    pricingIntelligence: false,
    changesInProposalDays: false,
    requestApprovalRevisedContract: false,
    reviseProposal: false,
    mergeRevisedProposal: false,
    clientFinalDecision: false,
    uploadRevisedContractReview: false,
    approveRevisedContractReview: false,
    attachRevisedProposal: false,
    requestQuotationChange: false
  };

  clientDecisionDate: string | null = null;
  clientDecisionChecked: boolean = false;

  uploadedFile?: File;
  uploadedFileUrl?: string;
  saving: boolean | undefined;

  constructor(private opportunityService: OpportunityService) {}

  ngOnInit() {
    // Initialize with existing data
    if (this.opportunity) {
      // Load checkbox states from opportunity
      this.checkboxStates = {
        competitorsDefined: this.opportunity.competitorsDefined || false,
        pricingIntelligence: this.opportunity.pricingIntelligence || false,
        changesInProposalDays: this.opportunity.changesInProposalDays || false,
        requestApprovalRevisedContract: this.opportunity.requestApprovalRevisedContract || false,
        reviseProposal: this.opportunity.reviseProposal || false,
        mergeRevisedProposal: this.opportunity.mergeRevisedProposal || false,
        clientFinalDecision: this.opportunity.clientFinalDecision || false,
        uploadRevisedContractReview: this.opportunity.uploadRevisedContractReview || false,
        approveRevisedContractReview: this.opportunity.approveRevisedContractReview || false,
        attachRevisedProposal: this.opportunity.attachRevisedProposal || false,
        requestQuotationChange: this.opportunity.requestQuotationChange || false
      };

      // Load client decision data
      if (this.opportunity.clientDecisionDate) {
        this.clientDecisionDate = new Date(this.opportunity.clientDecisionDate).toLocaleString();
        this.clientDecisionChecked = this.opportunity.clientFinalDecision;
      }

      // Check if file exists
      if (this.opportunity.revisedContractReviewFileName) {
        this.uploadedFileUrl = 'exists'; // Flag to show download button
      }
    }
  }

  onCheckboxChange(fieldName: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

    this.checkboxStates[fieldName] = isChecked;

    // Special handling for client final decision
    if (fieldName === 'clientFinalDecision') {
      this.onClientDecisionClick(isChecked);
    } else {
      // Update single checkbox
      const updateData = { [fieldName]: isChecked };

      this.opportunityService.updateNegotiationSteps(this.opportunity.id, updateData)
          .subscribe({
            next: (updatedOpportunity) => {
              this.opportunity = updatedOpportunity;
              this.emitOpportunityChange();
            },
            error: (error) => {
              console.error('Error updating negotiation step:', error);
              // Revert checkbox state on error
              this.checkboxStates[fieldName] = !isChecked;
              target.checked = !isChecked;
            }
          });
    }
  }

  onClientDecisionClick(checked?: boolean) {
    const isChecked = checked !== undefined ? checked : !this.clientDecisionChecked;
    this.clientDecisionChecked = isChecked;

    const updateData = { clientFinalDecision: isChecked };

    this.opportunityService.updateNegotiationSteps(this.opportunity.id, updateData)
        .subscribe({
          next: (updatedOpportunity) => {
            this.opportunity = updatedOpportunity;

            if (isChecked && updatedOpportunity.clientDecisionDate) {
              this.clientDecisionDate = new Date(updatedOpportunity.clientDecisionDate).toLocaleString();

              // CRITICAL FIX: Store data in the structure expected by pipeline-details
              this.opportunity.negotiationData = {
                ...this.opportunity.negotiationData,
                clientDecisionDate: updatedOpportunity.clientDecisionDate,
                clientFinalDecision: true
              };
            } else {
              this.clientDecisionDate = null;
              if (this.opportunity.negotiationData) {
                this.opportunity.negotiationData.clientDecisionDate = null;
                this.opportunity.negotiationData.clientFinalDecision = false;
              }
            }

            this.emitOpportunityChange();
          },
          error: (error) => {
            console.error('Error updating client decision:', error);
            // Revert state on error
            this.clientDecisionChecked = !isChecked;
          }
        });
  }

  onFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.uploadedFile = target.files[0];

      // Upload file to backend
      const formData = new FormData();
      formData.append('revisedContractFile', this.uploadedFile);
      formData.append('uploadRevisedContractReview', 'true');

      this.opportunityService.updateNegotiation(this.opportunity.id, formData)
          .subscribe({
            next: (updatedOpportunity) => {
              this.opportunity = updatedOpportunity;
              this.checkboxStates.uploadRevisedContractReview = true;
              this.uploadedFileUrl = 'exists'; // Show download button
              this.emitOpportunityChange();
            },
            error: (error) => {
              console.error('Error uploading file:', error);
              this.uploadedFile = undefined;
            }
          });
    }
  }

  downloadFile() {
    if (this.opportunity?.revisedContractReviewFileName) {
      this.opportunityService.downloadRevisedContract(this.opportunity.id)
          .subscribe({
            next: (blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = this.opportunity.revisedContractReviewFileName;
              link.click();
              window.URL.revokeObjectURL(url);
            },
            error: (error) => {
              console.error('Error downloading file:', error);
            }
          });
    } else if (this.uploadedFile) {
      // Fallback for local file
      const blobUrl = URL.createObjectURL(this.uploadedFile);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = this.uploadedFile.name;
      link.click();
      URL.revokeObjectURL(blobUrl);
    }
  }

  completeNegotiation() {
    this.opportunityService.completeNegotiation(this.opportunity.id)
        .subscribe({
          next: (updatedOpportunity) => {
            this.opportunity = updatedOpportunity;

            // Ensure negotiation completion is properly stored
            this.opportunity.negotiationCompleted = true;
            this.opportunity.negotiationCompletedAt = new Date().toISOString();

            this.emitOpportunityChange();
            alert('Negotiation completed successfully!');
          },
          error: (error) => {
            console.error('Error completing negotiation:', error);
            alert('Error completing negotiation. Please ensure all required steps are completed.');
          }
        });
  }

  // CRITICAL FIX: New method to properly emit changes
  private emitOpportunityChange() {
    // Make sure we emit the complete opportunity object
    const updatedOpportunity = {
      ...this.opportunity,
      // Ensure all checkbox states are reflected in the main opportunity object
      ...this.checkboxStates,
      // Ensure negotiation data structure is properly maintained
      negotiationData: {
        ...this.opportunity.negotiationData,
        clientDecisionDate: this.opportunity.clientDecisionDate,
        clientFinalDecision: this.checkboxStates.clientFinalDecision
      }
    };

    console.log('Emitting negotiation data:', updatedOpportunity.negotiationData);
    this.opportunityChange.emit(updatedOpportunity);
  }

  get quotationSignedDate(): string {
    return this.opportunity?.quotationSigned || 'Not available';
  }
}
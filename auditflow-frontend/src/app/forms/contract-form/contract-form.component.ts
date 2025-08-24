import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForOf, NgIf, CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  OpportunityService,
  AuditOpportunity,
  DocumentFile,
  MockFile,
  DocumentType
} from '../../opportunity.service';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  templateUrl: './contract-form.component.html',
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./contract-form.component.css']
})
export class ContractFormComponent implements OnInit {
  @Input() opportunity: AuditOpportunity = {} as AuditOpportunity;
  @Output() opportunityChange = new EventEmitter<AuditOpportunity>();
  @Input() disabled: boolean = false;

  saving = false;

  documentTypes: DocumentType[] = [
    {
      key: 'contractReviewFile',
      label: 'Contract Review Multistandard *',
      templateUrl: 'assets/templates/ContractReview.xlsx',
      required: true,
      pathField: 'contractReviewMultistandardPath',
      filenameField: 'contractReviewMultistandardFileName'
    },
    {
      key: 'applicationFormFile',
      label: 'P14 DF22E Application for Certification',
      templateUrl: 'assets/templates/DF22E.docx',
      required: false,
      pathField: 'applicationFormPath',
      filenameField: 'applicationFormFileName'
    },
    {
      key: 'signedQuotationFile',
      label: 'Signed Quotation *',
      templateUrl: 'assets/templates/Quotation.pdf',
      required: true,
      pathField: 'signedQuotationPath',
      filenameField: 'signedQuotationFileName'
    },
    {
      key: 'registrationFile',
      label: 'Company Commercial Registration',
      templateUrl: 'assets/templates/CommercialReg.pdf',
      required: false,
      pathField: 'registrationPath',
      filenameField: 'registrationFileName'
    },
    {
      key: 'otherDocsFile',
      label: 'Other Documents',
      templateUrl: 'assets/templates/OtherDocs.pdf',
      required: false,
      pathField: 'otherDocsPath',
      filenameField: 'otherDocsFileName'
    },
    {
      key: 'certDecisionFile',
      label: 'Certification Decision',
      templateUrl: 'assets/templates/Decision.pdf',
      required: false,
      pathField: 'certDecisionPath',
      filenameField: 'certDecisionFileName'
    },
    {
      key: 'auditPlanFile',
      label: 'P15 DF25a Stage 1 Audit Plan',
      templateUrl: 'assets/templates/Stage1Plan.docx',
      required: false,
      pathField: 'auditPlanPath',
      filenameField: 'auditPlanFileName'
    },
    {
      key: 'auditProgramFile',
      label: 'P14 DF24 Audit programme *',
      templateUrl: 'assets/templates/AuditProgram.docx',
      required: true,
      pathField: 'auditProgramPath',
      filenameField: 'auditProgramFileName'
    }
  ];

  uploadedDocuments: { [key: string]: (DocumentFile | MockFile)[] } = {};

  constructor(private opportunityService: OpportunityService) {}

  ngOnInit() {
    this.initializeFormData();
    this.loadExistingFiles();
  }

  initializeFormData() {
    // Initialize with default values if not set
    if (!this.opportunity.certLang) {
      this.opportunity.certLang = '';
    }
    if (!this.opportunity.certValidity) {
      this.opportunity.certValidity = '3';
    }
    if (!this.opportunity.expectedDate) {
      this.opportunity.expectedDate = '';
    }
    if (!this.opportunity.auditCode) {
      this.opportunity.auditCode = '';
    }
    if (this.opportunity.prepareWelcomeLetter === undefined) {
      this.opportunity.prepareWelcomeLetter = false;
    }

    // Initialize contract data structure if it doesn't exist
    if (!this.opportunity.contractData) {
      this.opportunity.contractData = {
        certLang: this.opportunity.certLang,
        certValidity: this.opportunity.certValidity,
        expectedDate: this.opportunity.expectedDate,
        auditCode: this.opportunity.auditCode,
        prepareWelcomeLetter: this.opportunity.prepareWelcomeLetter,
        documentsUploaded: {}
      };
    }
  }

  loadExistingFiles() {
    // Load existing files from backend paths
    this.documentTypes.forEach(doc => {
      const pathValue = this.opportunity[doc.pathField] as string;
      const filenameValue = this.opportunity[doc.filenameField] as string;

      if (pathValue && filenameValue) {
        // Create a mock file object for display purposes
        const mockFile: MockFile = {
          name: filenameValue,
          path: pathValue,
          isExisting: true
        };

        this.uploadedDocuments[doc.key] = [mockFile];

        // Update contract data
        if (!this.opportunity.contractData) {
          this.opportunity.contractData = {};
        }
        if (!this.opportunity.contractData.documentsUploaded) {
          this.opportunity.contractData.documentsUploaded = {};
        }
        this.opportunity.contractData.documentsUploaded[doc.key] = true;
      }
    });

    console.log('Loaded existing files:', this.uploadedDocuments);
  }

  onFieldChange(fieldName: keyof AuditOpportunity, value: any) {
    if (this.disabled) return;

    // Update the opportunity object
    this.opportunity[fieldName] = value;

    // Also update contractData structure
    if (!this.opportunity.contractData) {
      this.opportunity.contractData = {};
    }
    (this.opportunity.contractData as any)[fieldName] = value;

    // Emit the change to parent component
    this.emitOpportunityChange();

    // Auto-save with debounce
    this.triggerAutoSave();
  }

  onFileSelected(event: Event, key: string) {
    if (this.disabled) return;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0] as DocumentFile;

      console.log(`File selected for ${key}:`, file.name);

      // Store file in opportunity object for backend upload
      this.opportunity[key] = file;

      if (!this.uploadedDocuments[key]) {
        this.uploadedDocuments[key] = [];
      }
      this.uploadedDocuments[key] = [file]; // Replace previous file

      // Update contract data
      if (!this.opportunity.contractData) {
        this.opportunity.contractData = {};
      }
      if (!this.opportunity.contractData.documentsUploaded) {
        this.opportunity.contractData.documentsUploaded = {};
      }
      this.opportunity.contractData.documentsUploaded[key] = true;

      // Upload file immediately
      this.uploadFile(file, key);
    }
  }

  private uploadFile(file: File, documentType: string) {
    console.log(`Uploading ${file.name} for ${documentType}`);

    // Create a temporary opportunity object with the file for upload
    const uploadOpportunity = { ...this.opportunity };
    uploadOpportunity[documentType] = file;

    // Call the backend service to upload and save
    this.opportunityService.updateContract(uploadOpportunity).subscribe({
      next: (response) => {
        console.log('Contract file uploaded successfully:', response);

        // Update the local opportunity with response
        Object.assign(this.opportunity, response);

        // Update uploaded documents display with backend response
        const docType = this.documentTypes.find(doc => doc.key === documentType);
        if (docType) {
          const pathValue = response[docType.pathField] as string;
          const filenameValue = response[docType.filenameField] as string;

          if (pathValue && filenameValue) {
            const updatedFile: MockFile = {
              name: filenameValue,
              path: pathValue,
              isExisting: true
            };
            this.uploadedDocuments[documentType] = [updatedFile];
          }
        }

        this.emitOpportunityChange();
      },
      error: (error) => {
        console.error('Error uploading contract file:', error);
        // Remove file from local state on error
        delete this.opportunity[documentType];
        this.uploadedDocuments[documentType] = [];
        alert('Error uploading file. Please try again.');
      }
    });
  }

  getFileUrl(file: DocumentFile | MockFile): string {
    if ('isExisting' in file && file.isExisting && 'path' in file && file.path) {
      // For existing files, we would need a download endpoint
      return `#`; // Placeholder - implement download endpoint if needed
    }
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return '#';
  }

  isFormValid(): boolean {
    console.log('Validating form...');

    // Check required fields
    const requiredFieldsValid = !!(
        this.opportunity.expectedDate &&
        this.opportunity.auditCode
    );

    console.log('Required fields valid:', requiredFieldsValid);
    console.log('Expected Date:', this.opportunity.expectedDate);
    console.log('Audit Code:', this.opportunity.auditCode);

    // Check required documents
    const requiredDocsValid = this.documentTypes
        .filter(doc => doc.required)
        .every(doc => {
          const hasFile = this.uploadedDocuments[doc.key] && this.uploadedDocuments[doc.key].length > 0;
          const hasPath = this.opportunity[doc.pathField];
          const isValid = hasFile || hasPath;

          console.log(`Document ${doc.key}: hasFile=${hasFile}, hasPath=${hasPath}, valid=${isValid}`);
          return isValid;
        });

    console.log('Required docs valid:', requiredDocsValid);
    console.log('Overall form valid:', requiredFieldsValid && requiredDocsValid);

    return requiredFieldsValid && requiredDocsValid;
  }

  completeContract() {
    if (!this.isFormValid() || this.disabled || this.saving) {
      console.log('Cannot complete contract - validation failed or already saving');
      return;
    }

    this.saving = true;

    console.log('Completing contract phase...');
    console.log('Opportunity data:', this.opportunity);

    // First, save any pending changes
    this.opportunityService.updateContractJson(this.opportunity).subscribe({
      next: (updateResponse) => {
        console.log('Contract data updated:', updateResponse);

        // Then complete the contract
        this.opportunityService.completeContract(this.opportunity.id).subscribe({
          next: (completeResponse) => {
            console.log('Contract completed successfully:', completeResponse);

            // Update local opportunity with response
            Object.assign(this.opportunity, completeResponse);

            this.saving = false;
            this.emitOpportunityChange();

            alert('Contract phase completed successfully!');
          },
          error: (error) => {
            console.error('Error completing contract:', error);
            this.saving = false;

            let errorMessage = 'Error completing contract phase.';
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            alert(errorMessage);
          }
        });
      },
      error: (error) => {
        console.error('Error updating contract data:', error);
        this.saving = false;
        alert('Error saving contract data. Please try again.');
      }
    });
  }

  private emitOpportunityChange() {
    const updatedOpportunity: AuditOpportunity = {
      ...this.opportunity,
      contractData: {
        ...this.opportunity.contractData,
        certLang: this.opportunity.certLang,
        certValidity: this.opportunity.certValidity,
        expectedDate: this.opportunity.expectedDate,
        auditCode: this.opportunity.auditCode,
        prepareWelcomeLetter: this.opportunity.prepareWelcomeLetter,
        documentsUploaded: this.opportunity.contractData?.documentsUploaded || {},
        isValid: this.isFormValid()
      }
    };

    console.log('Emitting contract data:', updatedOpportunity.contractData);
    this.opportunityChange.emit(updatedOpportunity);
  }

  private saveTimeout: any;

  private triggerAutoSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.autoSave();
    }, 2000);
  }

  private autoSave() {
    if (this.disabled) return;

    console.log('Auto-saving contract data...');

    // Call the actual backend service
    this.opportunityService.updateContractJson(this.opportunity).subscribe({
      next: (response) => {
        console.log('Contract data auto-saved successfully');
        // Update local data with server response
        Object.assign(this.opportunity, response);
      },
      error: (error) => {
        console.error('Error auto-saving contract data:', error);
        // Don't show alert for auto-save errors to avoid annoying user
      }
    });
  }

  getRequiredDocumentsStatus(): string {
    const required = this.documentTypes.filter(doc => doc.required);
    const uploaded = required.filter(doc => {
      const hasFile = this.uploadedDocuments[doc.key] && this.uploadedDocuments[doc.key].length > 0;
      const hasPath = this.opportunity[doc.pathField];
      return hasFile || hasPath;
    });
    return `${uploaded.length}/${required.length}`;
  }

  // Helper method to check if a document is uploaded
  isDocumentUploaded(doc: DocumentType): boolean {
    const hasFile = this.uploadedDocuments[doc.key] && this.uploadedDocuments[doc.key].length > 0;
    const hasPath = this.opportunity[doc.pathField];
    return hasFile || hasPath;
  }

  // Helper method to get document status
  getDocumentStatus(doc: DocumentType): string {
    if (this.isDocumentUploaded(doc)) {
      return 'uploaded';
    }
    return doc.required ? 'required' : 'optional';
  }

  // Helper method to check if file is existing (type guard)
  isExistingFile(file: DocumentFile | MockFile): file is MockFile {
    return 'isExisting' in file && file.isExisting === true;
  }

  // Helper method to check if file is a regular File
  isRegularFile(file: DocumentFile | MockFile): file is DocumentFile {
    return file instanceof File;
  }

  // Helper methods for template access to avoid TypeScript errors
  getDocumentPath(doc: DocumentType): string {
    const pathValue = this.opportunity[doc.pathField];
    return pathValue ? String(pathValue) : 'None';
  }

  getDocumentFileName(doc: DocumentType): string {
    const filenameValue = this.opportunity[doc.filenameField];
    return filenameValue ? String(filenameValue) : 'None';
  }
}
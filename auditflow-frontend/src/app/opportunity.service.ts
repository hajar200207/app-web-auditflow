import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Opportunity {
    id: number;
    s1: string;
    s2: string;
    stage1: string;
    stage2: string;
}
export interface AuditOpportunity {
    id: number;
    opportunityName: string;
    stage: string;
    status: string;
    establishPrimaryContact: boolean;
    identifyPainPoints: boolean;
    determineBudget: boolean;
    confirmTimeline: boolean;
    reviewCompleted: boolean;
    reviewCompletedAt?: string;
    applicationSentDate?: string;
    fteNumber?: number;
    auditFrequency?: string;
    targetAuditDate?: string;
    mainLanguage?: string;
    riskLevel?: string;
    iafCategory?: string;
    scope?: string;
    scopeExclusions?: string;
    shiftCount?: number;
    imsApplication?: boolean;
    sitesProcesses?: string;
    consultantRelation?: string;
    trainingReferral?: string;
    legalRequirements?: string;
    contractReviewRequested?: boolean;
    contractReviewApproved?: boolean;
    availableAuditors?: string;

    // Step 3 - Proposal fields
    proposalTableShown?: boolean;
    proposalTableLocked?: boolean;
    proposalPaymentTerms?: string;
    proposalNumber?: string;
    proposalDate?: string;
    proposalClientProposal?: string;
    proposalFileName?: string;
    proposalFilePath?: string;
    proposalStagesData?: string;
    proposalCompleted?: boolean;
    proposalCompletedAt?: string;

    // CONTRACT FIELDS - Added to match backend
    certLang?: string;
    certValidity?: string;
    expectedDate?: string;
    auditCode?: string;
    prepareWelcomeLetter?: boolean;
    contractCompleted?: boolean;
    contractCompletedAt?: string;

    // Proposal file for upload
    proposalFile?: File;

    // CONTRACT FILES for upload
    contractReviewFile?: File;
    applicationFormFile?: File;
    signedQuotationFile?: File;
    registrationFile?: File;
    otherDocsFile?: File;
    certDecisionFile?: File;
    auditPlanFile?: File;
    auditProgramFile?: File;

    // File paths from backend
    applicationFilePath?: string;
    transferDocsPath?: string;
    fqApplicationPath?: string;
    certificationChangeFormPath?: string;
    commercialRegistrationPath?: string;
    fteCalculatorPath?: string;
    contractReviewPath?: string;
    approvedContractReviewPath?: string;

    // Files for upload (used in frontend)
    applicationFile?: File;
    transferDocsFile?: File;
    fqApplicationFile?: File;
    certificationChangeFile?: File;
    commercialRegistrationFile?: File;
    fteCalculatorFile?: File;
    approvedContractReviewFile?: File;


// Document paths and filenames for Other Documents
otherDocsPath?: string;
otherDocsFileName?: string;

// Document paths and filenames for Certification Decision
certDecisionPath?: string;
certDecisionFileName?: string;

// Document paths and filenames for Audit Plan
auditPlanPath?: string;
auditPlanFileName?: string;

// Document paths and filenames for Audit Program
auditProgramPath?: string;
auditProgramFileName?: string;

// Contract data structure for frontend state management
contractData?: ContractData;

// Allow for dynamic properties (like file uploads during form processing)
[key: string]: any;
}

export interface ContractData {
    certLang?: string;
    certValidity?: string;
    expectedDate?: string;
    auditCode?: string;
    prepareWelcomeLetter?: boolean;
    documentsUploaded?: { [key: string]: boolean };
    isValid?: boolean;
}

// Document file types for the form
export interface DocumentFile extends File {
    isExisting?: boolean;
    path?: string;
}

export interface MockFile {
    name: string;
    path: string;
    isExisting: boolean;
}

export interface DocumentType {
    key: string;
    label: string;
    templateUrl: string;
    required: boolean;
    pathField: keyof AuditOpportunity;
    filenameField: keyof AuditOpportunity;
}

@Injectable({ providedIn: 'root' })
export class OpportunityService {
    private baseUrl = 'http://localhost:8080/api/opportunities';
    private apiUrl = 'http://localhost:8080/api/opportunities';
    constructor(private http: HttpClient) {}

    updateReviewSteps(id: number, data: Partial<AuditOpportunity>): Observable<AuditOpportunity> {
        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${id}/review-steps`, data);
    }

    updatePotentialApplication(opportunity: AuditOpportunity): Observable<AuditOpportunity> {
        const formData = new FormData();

        // Ajouter tous les champs simples (non-file)
        const fieldsToInclude = [
            'applicationSentDate', 'scope', 'scopeExclusions', 'fteNumber', 'shiftCount',
            'auditFrequency', 'sitesProcesses', 'imsApplication', 'targetAuditDate',
            'mainLanguage', 'consultantRelation', 'trainingReferral', 'riskLevel',
            'iafCategory', 'availableAuditors', 'legalRequirements',
            'contractReviewRequested', 'contractReviewApproved'
        ];

        fieldsToInclude.forEach(field => {
            const value = (opportunity as any)[field];
            if (value !== undefined && value !== null && value !== '') {
                formData.append(field, String(value));
            }
        });

        // Ajouter les fichiers
        const fileMapping = [
            { frontendKey: 'applicationFile', backendKey: 'applicationFile' },
            { frontendKey: 'transferDocsFile', backendKey: 'transferDocsFile' },
            { frontendKey: 'fqApplicationFile', backendKey: 'fqApplicationFile' },
            { frontendKey: 'certificationChangeFile', backendKey: 'certificationChangeFile' },
            { frontendKey: 'commercialRegistrationFile', backendKey: 'commercialRegistrationFile' },
            { frontendKey: 'fteCalculatorFile', backendKey: 'fteCalculatorFile' },
            { frontendKey: 'contractReviewFile', backendKey: 'contractReviewFile' },
            { frontendKey: 'approvedContractReviewFile', backendKey: 'approvedContractReviewFile' }
        ];

        fileMapping.forEach(mapping => {
            const file = (opportunity as any)[mapping.frontendKey];
            if (file && file instanceof File) {
                formData.append(mapping.backendKey, file, file.name);
            }
        });

        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${opportunity.id}/potential-application`, formData);
    }

    // Alternative method for JSON data (without files) for testing
    updatePotentialApplicationJson(opportunity: AuditOpportunity): Observable<AuditOpportunity> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        // Create a clean object without File properties
        const cleanOpportunity = { ...opportunity };
        delete (cleanOpportunity as any).applicationFile;
        delete (cleanOpportunity as any).transferDocsFile;
        delete (cleanOpportunity as any).fqApplicationFile;
        delete (cleanOpportunity as any).certificationChangeFile;
        delete (cleanOpportunity as any).commercialRegistrationFile;
        delete (cleanOpportunity as any).fteCalculatorFile;
        delete (cleanOpportunity as any).contractReviewFile;
        delete (cleanOpportunity as any).approvedContractReviewFile;

        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${opportunity.id}/potential-application-json`, cleanOpportunity, { headers });
    }

    completeReview(id: number): Observable<AuditOpportunity> {
        return this.http.post<AuditOpportunity>(`${this.baseUrl}/${id}/review-steps/complete`, {});
    }

    getOpportunity(id: number): Observable<AuditOpportunity> {
        return this.http.get<AuditOpportunity>(`${this.baseUrl}/${id}`);
    }

    getAllOpportunities(): Observable<AuditOpportunity[]> {
        return this.http.get<AuditOpportunity[]>(`${this.baseUrl}`);
    }

    // Step 3 - Proposal methods
    updateProposal(opportunity: AuditOpportunity): Observable<AuditOpportunity> {
        const formData = new FormData();

        // Ajouter tous les champs simples (non-file)
        const fieldsToInclude = [
            'proposalTableShown', 'proposalTableLocked', 'proposalPaymentTerms',
            'proposalNumber', 'proposalDate', 'proposalClientProposal',
            'proposalStagesData', 'proposalFileName'
        ];

        fieldsToInclude.forEach(field => {
            const value = (opportunity as any)[field];
            if (value !== undefined && value !== null && value !== '') {
                formData.append(field, String(value));
            }
        });

        // Ajouter le fichier proposal
        if (opportunity.proposalFile && opportunity.proposalFile instanceof File) {
            formData.append('proposalFile', opportunity.proposalFile, opportunity.proposalFile.name);
        }

        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${opportunity.id}/proposal`, formData);
    }

    updateProposalJson(opportunity: AuditOpportunity): Observable<AuditOpportunity> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        // Create proposal data object
        const proposalData = {
            proposalTableShown: opportunity.proposalTableShown,
            proposalTableLocked: opportunity.proposalTableLocked,
            proposalPaymentTerms: opportunity.proposalPaymentTerms,
            proposalNumber: opportunity.proposalNumber,
            proposalDate: opportunity.proposalDate,
            proposalClientProposal: opportunity.proposalClientProposal,
            proposalStagesData: opportunity.proposalStagesData,
            proposalFileName: opportunity.proposalFileName
        };

        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${opportunity.id}/proposal-json`, proposalData, { headers });
    }

    completeProposal(id: number): Observable<AuditOpportunity> {
        return this.http.post<AuditOpportunity>(`${this.baseUrl}/${id}/proposal/complete`, {});
    }

    // Negotiation methods
    updateNegotiationSteps(opportunityId: number, steps: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${opportunityId}/negotiation-steps`, steps);
    }

    updateNegotiation(opportunityId: number, formData: FormData): Observable<any> {
        return this.http.put(`${this.baseUrl}/${opportunityId}/negotiation`, formData);
    }

    completeNegotiation(opportunityId: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/${opportunityId}/negotiation/complete`, {});
    }

    downloadRevisedContract(opportunityId: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${opportunityId}/negotiation/download-revised-contract`, {
            responseType: 'blob'
        });
    }

    updateContract(opportunity: AuditOpportunity): Observable<AuditOpportunity> {
        const formData = new FormData();

        // Add text fields
        const fieldsToInclude = [
            'certLang', 'certValidity', 'expectedDate', 'auditCode', 'prepareWelcomeLetter'
        ];

        fieldsToInclude.forEach(field => {
            const value = opportunity[field];
            if (value !== undefined && value !== null && value !== '') {
                formData.append(field, String(value));
            }
        });

        // Add contract document files
        const contractFileMapping = [
            { frontendKey: 'contractReviewFile', backendKey: 'contractReviewFile' },
            { frontendKey: 'applicationFormFile', backendKey: 'applicationFormFile' },
            { frontendKey: 'signedQuotationFile', backendKey: 'signedQuotationFile' },
            { frontendKey: 'registrationFile', backendKey: 'registrationFile' },
            { frontendKey: 'otherDocsFile', backendKey: 'otherDocsFile' },
            { frontendKey: 'certDecisionFile', backendKey: 'certDecisionFile' },
            { frontendKey: 'auditPlanFile', backendKey: 'auditPlanFile' },
            { frontendKey: 'auditProgramFile', backendKey: 'auditProgramFile' }
        ];

        contractFileMapping.forEach(mapping => {
            const file = opportunity[mapping.frontendKey];
            if (file && file instanceof File) {
                formData.append(mapping.backendKey, file, file.name);
            }
        });

        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${opportunity.id}/contract`, formData);
    }
    getAll(): Observable<Opportunity[]> {
        return this.http.get<Opportunity[]>(this.apiUrl);
    }
    // Update contract JSON data only (no files)
    updateContractJson(opportunity: AuditOpportunity): Observable<AuditOpportunity> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        // Create contract data object (text fields only, no files)
        const contractData = {
            certLang: opportunity.certLang,
            certValidity: opportunity.certValidity,
            expectedDate: opportunity.expectedDate,
            auditCode: opportunity.auditCode,
            prepareWelcomeLetter: opportunity.prepareWelcomeLetter
        };

        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${opportunity.id}/contract-json`, contractData, { headers });
    }

    // Complete contract phase
    completeContract(id: number): Observable<AuditOpportunity> {
        return this.http.post<AuditOpportunity>(`${this.baseUrl}/${id}/contract/complete`, {});
    }



    // Get all opportunities
    getOpportunities(): Observable<Opportunity[]> {
        return this.http.get<Opportunity[]>(this.apiUrl);
    }

    // Create new opportunity
    createOpportunity(opportunity: Partial<AuditOpportunity>): Observable<AuditOpportunity> {
        return this.http.post<AuditOpportunity>(`${this.baseUrl}`, opportunity);
    }

    // Update opportunity
    updateOpportunity(opportunity: AuditOpportunity): Observable<AuditOpportunity> {
        return this.http.put<AuditOpportunity>(`${this.baseUrl}/${opportunity.id}`, opportunity);
    }

    // Delete opportunity
    deleteOpportunity(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

}
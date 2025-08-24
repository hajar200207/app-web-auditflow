import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditOpportunity } from './opportunity.service';

export interface Project {
    id: number;
    opportunityName: string;
    opportunityId: number;
    companyId: number;
    company: {
        id: number;
        name: string;
    };

    // Audit stage fields
    auditCode: string;
    stageType: string;
    teamLeader?: string;
    auditTeam?: string;
    witnessAudit: boolean;
    auditType: string;
    quotationDays: number;
    assignedDays: number;

    // Date fields
    auditPlanSentDate?: string;
    auditReportSentDate?: string;
    handedForReviewDate?: string;
    submittedToCaDate?: string;
    tentativeDates?: string;
    confirmedDates?: string;
    plannedDates?: string;

    // Status and completion fields
    status: 'Un-Assigned' | 'Assigned' | 'In Progress' | 'Completed' | 'On Hold';
    releaseDate?: string;
    certificateDetails?: string;
    paymentDetails?: string;
    paymentNotes?: string;

    // Audit metadata
    assignedAuditor: string;

    // System fields
    createdDate: string;
    lastModified?: string;

    // Relationships
    opportunity?: AuditOpportunity;
}

// Legacy interface for backward compatibility
export interface AuditStage {
    id: number;
    projectId: number;
    auditCode?: string;
    stageType: 'Stage 1' | 'Stage 2' | 'Surveillance 1' | 'Surveillance 2' | 'Re-certification';
    teamLeader?: string;
    auditTeam?: string;
    witnessAudit: boolean;
    auditType: 'Onsite Audit' | 'Remote Audit' | 'Hybrid Audit';
    quotationDays: number;
    auditPlanSentDate?: string;
    auditReportSentDate?: string;
    handedForReviewDate?: string;
    submittedToCaDate?: string;
    plannedDates?: string;
    assignedDays: number;
    tentativeDates?: string;
    confirmedDates?: string;
    status: 'Un-Assigned' | 'Assigned' | 'In Progress' | 'Completed' | 'On Hold';
    releaseDate?: string;
    paymentNotes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:8080/api';
    private opportunities: AuditOpportunity[] = [];

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    }

    setOpportunityDone(opportunityId: number) {
        const opp = this.opportunities.find(o => o.id === opportunityId);
        if (opp) {
            opp.status = 'done';

            // Créer 4 projets enfants (s1, s2, m1, m2)
            (opp as any)['projects'] = [
                {
                    id: 0,
                    opportunityName: opp.opportunityName,
                    opportunityId: opp.id,
                    companyId: (opp as any).company?.id || 0,
                    company: (opp as any).company || { id: 0, name: 'N/A' },
                    certValidity: (opp as any).certValidity || '',
                    projectName: 'S1',
                    standard: (opp as any).standard || '',
                    fileNumber: '',
                    estimatedValue: 0,
                    assignedAuditor: (opp as any).assignedAuditor || '',
                    certificationBody: '',
                    type: 'Audit',
                    status: 'Active',
                    createdDate: new Date().toISOString(),
                    auditStages: []
                },
                {
                    id: 0,
                    opportunityName: opp.opportunityName,
                    opportunityId: opp.id,
                    companyId: (opp as any).company?.id || 0,
                    company: (opp as any).company || { id: 0, name: 'N/A' },
                    certValidity: (opp as any).certValidity || '',
                    projectName: 'S2',
                    standard: (opp as any).standard || '',
                    fileNumber: '',
                    estimatedValue: 0,
                    assignedAuditor: (opp as any).assignedAuditor || '',
                    certificationBody: '',
                    type: 'Audit',
                    status: 'Active',
                    createdDate: new Date().toISOString(),
                    auditStages: []
                },
                {
                    id: 0,
                    opportunityName: opp.opportunityName,
                    opportunityId: opp.id,
                    companyId: (opp as any).company?.id || 0,
                    company: (opp as any).company || { id: 0, name: 'N/A' },
                    certValidity: (opp as any).certValidity || '',
                    projectName: 'M1',
                    standard: (opp as any).standard || '',
                    fileNumber: '',
                    estimatedValue: 0,
                    assignedAuditor: (opp as any).assignedAuditor || '',
                    certificationBody: '',
                    type: 'Audit',
                    status: 'Active',
                    createdDate: new Date().toISOString(),
                    auditStages: []
                },
                {
                    id: 0,
                    opportunityName: opp.opportunityName,
                    opportunityId: opp.id,
                    companyId: (opp as any).company?.id || 0,
                    company: (opp as any).company || { id: 0, name: 'N/A' },
                    certValidity: (opp as any).certValidity || '',
                    projectName: 'M2',
                    standard: (opp as any).standard || '',
                    fileNumber: '',
                    estimatedValue: 0,
                    assignedAuditor: (opp as any).assignedAuditor || '',
                    certificationBody: '',
                    type: 'Audit',
                    status: 'Active',
                    createdDate: new Date().toISOString(),
                    auditStages: []
                }
            ];
        }
    }

    // Créer un projet à partir d'une opportunité
    createProjectFromOpportunity(opportunityId: number): Observable<Project> {
        return this.http.post<Project>(
            `${this.apiUrl}/projects/convert/${opportunityId}`,
            {},
            { headers: this.getHeaders() }
        );
    }

    // Récupérer tous les projets
    getAllProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(
            `${this.apiUrl}/projects`,
            { headers: this.getHeaders() }
        );
    }

    // Récupérer les projets par entreprise
    getProjectsByCompany(companyId: number): Observable<Project[]> {
        return this.http.get<Project[]>(
            `${this.apiUrl}/projects/company/${companyId}`,
            { headers: this.getHeaders() }
        );
    }

    // Compter les projets par entreprise
    countProjectsByCompany(companyId: number): Observable<number> {
        return this.http.get<number>(
            `${this.apiUrl}/projects/count/${companyId}`,
            { headers: this.getHeaders() }
        );
    }

    // Récupérer un projet par ID
    getProjectById(projectId: number): Observable<Project> {
        return this.http.get<Project>(
            `${this.apiUrl}/projects/${projectId}`,
            { headers: this.getHeaders() }
        );
    }

    // Mettre à jour un projet
    updateProject(projectId: number, project: Partial<Project>): Observable<Project> {
        return this.http.put<Project>(
            `${this.apiUrl}/projects/${projectId}`,
            project,
            { headers: this.getHeaders() }
        );
    }

    // Supprimer un projet
    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/projects/${id}`,
            { headers: this.getHeaders() }
        );
    }

    // Méthodes audit-stages
    addAuditStage(projectId: number, stage: Partial<AuditStage>): Observable<AuditStage> {
        return this.http.post<AuditStage>(
            `${this.apiUrl}/projects/${projectId}/audit-stages`,
            stage,
            { headers: this.getHeaders() }
        );
    }

    updateAuditStage(stageId: number, stage: Partial<AuditStage>): Observable<AuditStage> {
        return this.http.put<AuditStage>(
            `${this.apiUrl}/projects/audit-stages/${stageId}`,
            stage,
            { headers: this.getHeaders() }
        );
    }

    // Compter tous les projets
    getTotalProjectsCount(): Observable<number> {
        return this.http.get<number>(
            `${this.apiUrl}/projects/count`,
            { headers: this.getHeaders() }
        );
    }

    getCountProjectsByOpportunityStatusDone(): Observable<number> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<number>(`${this.apiUrl}/projects/count/status-done`, { headers });
    }
    createProjectsForCompletedOpportunity(opportunityId: number): Observable<Project[]> {
        return this.http.post<Project[]>(
            `${this.apiUrl}/projects/opportunity/${opportunityId}/create-projects`,
            {},
            { headers: this.getHeaders() }
        );
    }

    getOpportunitiesByCompany(companyId: number): Observable<any[]> {
        return this.http.get<any[]>(
            `${this.apiUrl}/opportunities/company/${companyId}`,
            { headers: this.getHeaders() }
        );
    }
    getProjectsWithAuditStagesByCompany(companyId: number): Observable<Project[]> {
        return this.http.get<Project[]>(
            `${this.apiUrl}/projects/company/${companyId}/with-audit-stages`,
            { headers: this.getHeaders() }
        );
    }
}
export interface Project {
    auditCodeName: string; // s1, s2, m1, m2
    teamLeader?: string;
    auditTeam?: string;
    witnessAudit?: boolean;
    auditType?: string;
    quotationDays?: number;
    dates?: string;
    plannedDates?: string;
    assignedDays?: number;
    tentativeDates?: string;
    confirmedDates?: string;
    status?: string;
    certificateDetails?: string;
    paymentDetails?: string;
}

export interface AuditOpportunity {
    companyName: string;
    status: string; // done / pending ...
    projects: Project[];
}

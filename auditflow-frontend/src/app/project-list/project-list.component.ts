/*
/!*
// project-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService, Project } from '../project.service';
import { FormsModule } from "@angular/forms";
import { Location } from '@angular/common';
import {Opportunity, OpportunityService} from "../opportunity.service";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe]
})
export class ProjectListComponent implements OnInit {
  companyId!: number;
  companyName: string = '';
  projects: Project[] = [];
  loading: boolean = true;
  selectedProject: Project | null = null;
  opportunities: Opportunity[] = [];

  // User role for permissions
  userRole: string = localStorage.getItem('role') || 'auditor';

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private projectService: ProjectService,
      private location: Location,
      private opportunityService: OpportunityService,
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
    this.companyName = this.route.snapshot.queryParamMap.get('companyName') || 'Unknown Company';
    this.loadProjects();
    this.loadOpportunities();
  }
  getProjectsWithOpportunityDone(): Project[] {
    return this.projects.filter(p => p.opportunity?.status === 'Done');
  }
  loadOpportunities(): void {
    this.opportunityService.getAll().subscribe({
      next: (data) => {
        this.opportunities = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération opportunités', err);
        this.loading = false;
      }
    });
  }
  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjectsByCompany(this.companyId).subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
        console.log('Projects loaded:', data);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
        // Handle error - maybe show toast message
      }
    });
  }


  // Track function for ngFor optimization
  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get CSS class based on project status
  getProjectStatusClass(status: string): string {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return `project-row status-${statusClass}`;
  }

  // Check if user can edit project
  canEditProject(project: Project): boolean {
    return this.userRole === 'admin' ||
        (this.userRole === 'auditor' && project.status !== 'Completed');
  }

  // View audit stages modal
  viewAuditStages(project: Project): void {
    this.selectedProject = project;
  }

  // Close audit stages modal
  closeAuditStagesModal(): void {
    this.selectedProject = null;
  }

  // Navigation methods
  goBack(): void {
    this.location.back();
  }

  // Navigate to project details
  viewProjectDetails(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  // Navigate to create new project
  createNewProject(): void {
    this.router.navigate(['/projects/create'], {
      queryParams: { companyId: this.companyId }
    });
  }

  // Get project progress percentage
  getProjectProgress(project: Project): number {
    if (!project.auditStages || project.auditStages.length === 0) {
      return 0;
    }

    const completedStages = project.auditStages.filter(stage =>
        stage.status === 'Completed'
    ).length;

    return Math.round((completedStages / project.auditStages.length) * 100);
  }

  // Get next audit stage
  getNextAuditStage(project: Project): string {
    if (!project.auditStages || project.auditStages.length === 0) {
      return 'No stages defined';
    }

    const nextStage = project.auditStages.find(stage =>
        stage.status === 'Assigned' || stage.status === 'Un-Assigned'
    );

    return nextStage ? nextStage.stageType : 'All stages completed';
  }

  // Export projects to CSV (admin feature)
  exportProjects(): void {
    if (this.userRole !== 'admin') return;

    const csvContent = this.convertProjectsToCSV();
    this.downloadCSV(csvContent, `projects_company_${this.companyId}.csv`);
  }

  private convertProjectsToCSV(): string {
    const headers = [
      'Project Name', 'File Number', 'Standard', 'Status', 'Type',
      'Assigned Auditor', 'Estimated Value', 'Created Date', 'Last Modified'
    ];

    const rows = this.projects.map(project => [
      project.projectName,
      project.fileNumber || '',
      project.standard,
      project.status,
      project.type,
      project.assignedAuditor,
      project.estimatedValue.toString(),
      this.formatDate(project.createdDate),
      project.lastModified ? this.formatDate(project.lastModified) : ''
    ]);

    return [headers, ...rows].map(row =>
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filter projects by status
  filterProjectsByStatus(status: string): void {
    // Implementation for filtering - you can add this functionality
    console.log('Filter by status:', status);
  }
  goToAuditPackage(projectId: number) {
    this.router.navigate(['/dashboard-auditor/audit-package/create', projectId]);
  }

  goToAuditNote(projectId: number) {
    this.router.navigate(['/dashboard-auditor/audit-note/create', projectId]);
  }

  goToRequestCertificate(projectId: number) {
    this.router.navigate(['/dashboard-auditor/certificate-request/create', projectId]);
  }

  getStageStatus(project: any, stageType: string): string {
    if (!project || !project.auditStages) {
      return 'N/A';
    }
    const stage = project.auditStages.find((s: any) => s.stageType === stageType);
    return stage ? stage.status : 'N/A';
  }

}*!/
// project-list.component.ts - FIXED VERSION
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {ProjectService, Project, AuditStage} from '../project.service';
import { FormsModule } from "@angular/forms";
import { Location } from '@angular/common';
import { Opportunity, OpportunityService } from "../opportunity.service";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe]
})
export class ProjectListComponent implements OnInit {
  companyId!: number;
  companyName: string = '';
  projects: Project[] = [];
  loading: boolean = true;
  selectedProject: Project | null = null;
  opportunities: Opportunity[] = [];

  // Projects specifically with opportunity status 'Done'
  projectsWithDoneStatus: Project[] = [];

  // User role for permissions
  userRole: string = localStorage.getItem('role') || 'auditor';

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private projectService: ProjectService,
      private location: Location,
      private opportunityService: OpportunityService,
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
    this.companyName = this.route.snapshot.queryParamMap.get('companyName') || 'Unknown Company';
    this.loadAllData();
  }

  /!**
   * Load all data concurrently
   *!/
  loadAllData(): void {
    this.loading = true;

    // Use forkJoin to load projects and opportunities concurrently
    forkJoin({
      projects: this.projectService.getProjectsByCompany(this.companyId),
      opportunities: this.opportunityService.getAll()
    }).subscribe({
      next: (data) => {
        this.projects = data.projects || [];
        this.opportunities = data.opportunities || [];

        // Filter projects with 'Done' opportunity status
        this.filterProjectsWithDoneStatus();

        this.loading = false;
        console.log('Projects loaded:', this.projects);
        console.log('Opportunities loaded:', this.opportunities);
        console.log('Projects with Done status:', this.projectsWithDoneStatus);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  /!**
   * Filter projects that have opportunity with status 'Done'
   *!/
  filterProjectsWithDoneStatus(): void {
    this.projectsWithDoneStatus = this.projects.filter(project => {
      // Check if project has opportunity and status is 'Done'
      return project.opportunity &&
          project.opportunity.status &&
          project.opportunity.status.toLowerCase() === 'done';
    });
  }

  /!**
   * Get projects with opportunity status 'Done' - fixed method
   *!/
  getProjectsWithOpportunityDone(): Project[] {
    return this.projectsWithDoneStatus;
  }

  loadOpportunities(): void {
    this.opportunityService.getAll().subscribe({
      next: (data) => {
        this.opportunities = data || [];
        console.log('Opportunities loaded separately:', this.opportunities);
      },
      error: (err) => {
        console.error('Erreur récupération opportunités', err);
      }
    });
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getProjectsByCompany(this.companyId).subscribe({
      next: (data) => {
        this.projects = data || [];
        this.filterProjectsWithDoneStatus();
        this.loading = false;
        console.log('Projects loaded:', data);
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  // Track function for ngFor optimization
  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  // Track function for opportunities
  trackByOpportunityId(index: number, opportunity: Opportunity): number {
    return opportunity.id;
  }

  // Track function for audit stages
  trackByStageId(index: number, stage: AuditStage): number {
    return stage.id;
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get CSS class based on project status
  getProjectStatusClass(status: string): string {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return `project-row status-${statusClass}`;
  }

  // Check if user can edit project
  canEditProject(project: Project): boolean {
    return this.userRole === 'admin' ||
        (this.userRole === 'auditor' && project.status !== 'Completed');
  }

  // View audit stages modal
  viewAuditStages(project: Project): void {
    this.selectedProject = project;
  }

  // Close audit stages modal
  closeAuditStagesModal(): void {
    this.selectedProject = null;
  }

  // Navigation methods
  goBack(): void {
    this.location.back();
  }

  // Navigate to project details
  viewProjectDetails(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  // Navigate to create new project
  createNewProject(): void {
    this.router.navigate(['/projects/create'], {
      queryParams: { companyId: this.companyId }
    });
  }

  // Get project progress percentage
  getProjectProgress(project: Project): number {
    if (!project.auditStages || project.auditStages.length === 0) {
      return 0;
    }

    const completedStages = project.auditStages.filter(stage =>
        stage.status === 'Completed'
    ).length;

    return Math.round((completedStages / project.auditStages.length) * 100);
  }

  // Get next audit stage
  getNextAuditStage(project: Project): string {
    if (!project.auditStages || project.auditStages.length === 0) {
      return 'No stages defined';
    }

    const nextStage = project.auditStages.find(stage =>
        stage.status === 'Assigned' || stage.status === 'Un-Assigned'
    );

    return nextStage ? nextStage.stageType : 'All stages completed';
  }

  // Export projects to CSV (admin feature)
  exportProjects(): void {
    if (this.userRole !== 'admin') return;

    const csvContent = this.convertProjectsToCSV();
    this.downloadCSV(csvContent, `projects_company_${this.companyId}.csv`);
  }

  private convertProjectsToCSV(): string {
    const headers = [
      'Project Name', 'File Number', 'Standard', 'Status', 'Type',
      'Assigned Auditor', 'Estimated Value', 'Created Date', 'Last Modified'
    ];

    const rows = this.projects.map(project => [
      project.projectName,
      project.fileNumber || '',
      project.standard,
      project.status,
      project.type,
      project.assignedAuditor,
      project.estimatedValue.toString(),
      this.formatDate(project.createdDate),
      project.lastModified ? this.formatDate(project.lastModified) : ''
    ]);

    return [headers, ...rows].map(row =>
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filter projects by status
  filterProjectsByStatus(status: string): void {
    console.log('Filter by status:', status);
  }

  goToAuditPackage(projectId: number) {
    this.router.navigate(['/dashboard-auditor/audit-package/create', projectId]);
  }

  goToAuditNote(projectId: number) {
    this.router.navigate(['/dashboard-auditor/audit-note/create', projectId]);
  }

  goToRequestCertificate(projectId: number) {
    this.router.navigate(['/dashboard-auditor/certificate-request/create', projectId]);
  }

  /!**
   * Get stage status for a specific project and stage type
   * Fixed to properly handle audit stages
   *!/
  getStageStatus(project: Project, stageType: string): string {
    if (!project || !project.auditStages || project.auditStages.length === 0) {
      return 'N/A';
    }

    const stage = project.auditStages.find((s: any) =>
        s.stageType === stageType ||
        s.stageType === stageType.replace(/\s/g, '') // Handle spacing differences
    );

    return stage ? stage.status : 'N/A';
  }

  /!**
   * Get audit stage details for display
   *!/
  getAuditStageDetails(project: Project, stageType: string): any {
    if (!project || !project.auditStages || project.auditStages.length === 0) {
      return null;
    }

    return project.auditStages.find((s: any) =>
        s.stageType === stageType ||
        s.stageType === stageType.replace(/\s/g, '')
    );
  }

  /!**
   * Check if project has any audit stages
   *!/
  hasAuditStages(project: Project): boolean {
    return project && project.auditStages && project.auditStages.length > 0;
  }

  /!**
   * Get opportunity details for a project
   *!/
  getOpportunityDetails(project: Project): any {
    if (!project || !project.opportunity) {
      return null;
    }
    return project.opportunity;
  }

  /!**
   * Refresh data
   *!/
  refreshData(): void {
    this.loadAllData();
  }
}*/
// project-list.component.ts - FIXED VERSION
// project-list.component.ts - FIXED VERSION
/*
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService, Project, AuditStage } from '../project.service';
import { FormsModule } from "@angular/forms";
import { Location } from '@angular/common';
import { OpportunityService, AuditOpportunity } from "../opportunity.service";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProjectListComponent implements OnInit {
  companyId!: number;
  companyName: string = '';
  projects: Project[] = [];
  allOpportunities: AuditOpportunity[] = [];
  loading: boolean = true;
  selectedProject: Project | null = null;

  // Projects specifically with opportunity status 'Done'
  projectsWithDoneStatus: Project[] = [];

  // Statistics
  stats = {
    totalProjects: 0,
    completedStages: 0,
    inProgressStages: 0,
    pendingStages: 0
  };

  // User role for permissions
  userRole: string = localStorage.getItem('role') || 'auditor';
  opportunities: any[] = [];

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private projectService: ProjectService,
      private location: Location,
      private opportunityService: OpportunityService,
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
    this.companyName = this.route.snapshot.queryParamMap.get('companyName') || 'Unknown Company';
    this.loadAllData();
    this.loadOpportunities();
  }

  loadOpportunities() {
    this.projectService.getOpportunitiesByCompany(this.companyId).subscribe((data: any[]) => {
      this.opportunities = data;

      // Pour chaque opportunity DONE, générer les projets
      this.opportunities.forEach(opp => {
        if (opp.status?.toLowerCase() === 'done') {
          this.generateProjectsForOpportunity(opp);
        }
      });
    });
  }

  generateProjectsForOpportunity(opp: any) {
    if (!opp['projects']) opp['projects'] = [];

    const projectNames = ['S1', 'S2', 'M1', 'M2'];

    projectNames.forEach(name => {
      // Create a proper AuditOpportunity object with all required fields from opportunity.service.ts
      const opportunity: AuditOpportunity = {
        id: opp['id'] || 0,
        opportunityName: opp['opportunityName'] || '',
        stage: opp['stage'] || '',
        status: opp['status'] || 'unknown',
        establishPrimaryContact: opp['establishPrimaryContact'] || false,
        identifyPainPoints: opp['identifyPainPoints'] || false,
        determineBudget: opp['determineBudget'] || false,
        confirmTimeline: opp['confirmTimeline'] || false,
        reviewCompleted: opp['reviewCompleted'] || false,

        // Optional fields with defaults
        availableAuditors: opp['availableAuditors'] || '',
        reviewCompletedAt: opp['reviewCompletedAt'] || undefined,
        applicationSentDate: opp['applicationSentDate'] || undefined,
        fteNumber: opp['fteNumber'] || undefined,
        auditFrequency: opp['auditFrequency'] || undefined,
        targetAuditDate: opp['targetAuditDate'] || undefined,
        mainLanguage: opp['mainLanguage'] || undefined,
        riskLevel: opp['riskLevel'] || undefined,
        iafCategory: opp['iafCategory'] || undefined,
        scope: opp['scope'] || undefined,
        scopeExclusions: opp['scopeExclusions'] || undefined,
        shiftCount: opp['shiftCount'] || undefined,
        imsApplication: opp['imsApplication'] || undefined,
        sitesProcesses: opp['sitesProcesses'] || undefined,
        consultantRelation: opp['consultantRelation'] || undefined,
        trainingReferral: opp['trainingReferral'] || undefined,
        legalRequirements: opp['legalRequirements'] || undefined,
        contractReviewRequested: opp['contractReviewRequested'] || undefined,
        contractReviewApproved: opp['contractReviewApproved'] || undefined,

        // Add any additional fields that might exist
        ...Object.keys(opp).reduce((acc, key) => {
          if (!['id', 'opportunityName', 'stage', 'status', 'establishPrimaryContact', 'identifyPainPoints', 'determineBudget', 'confirmTimeline', 'reviewCompleted'].includes(key)) {
            acc[key] = opp[key];
          }
          return acc;
        }, {} as any)
      };

      const newProject: Project = {
        id: 0,
        opportunityName: opp['opportunityName'] || 'N/A',
        opportunityId: opp['id'] || 0,
        companyId: opp['company']?.['id'] || 0,
        company: opp['company'] || { id: 0, name: 'N/A' },
        certValidity: opp['certValidity'] || '',
        projectName: name,
        standard: opp['standard'] || '',
        fileNumber: '',
        originalCertificationDate: undefined,
        expiryDate: undefined,
        estimatedValue: 0,
        assignedAuditor: opp['assignedAuditor'] || '',
        certificationBody: '',
        type: 'Audit',
        status: 'Active',
        createdDate: new Date().toISOString(),
        auditStages: [],
        certificateDetails: '',
        paymentDetails: '',
        opportunity: opportunity
      };

      opp['projects'].push(newProject);
    });
  }

  /!**
   * Load all data concurrently
   *!/
  loadAllData(): void {
    this.loading = true;

    forkJoin({
      projects: this.projectService.getProjectsByCompany(this.companyId),
      opportunities: this.opportunityService.getAllOpportunities()
    }).subscribe({
      next: (data) => {
        this.projects = data.projects || [];
        this.allOpportunities = data.opportunities || [];

        // Filter projects with 'Done' opportunity status
        this.filterProjectsWithDoneStatus();

        // Update statistics
        this.updateStatistics();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  /!**
   * Filter projects that have opportunity with status 'Done'
   *!/
  filterProjectsWithDoneStatus(): void {
    this.projectsWithDoneStatus = this.projects.filter(project =>
        project.opportunity?.status?.toLowerCase() === 'done'
    );
  }

  getAuditTypeClass(stage: AuditStage): string {
    return 'audit-type-' + (stage?.auditType ? stage.auditType.toLowerCase().replace(/ /g, '-') : '');
  }

  updateStatistics(): void {
    this.stats.totalProjects = this.projectsWithDoneStatus.length;
    this.stats.completedStages = 0;
    this.stats.inProgressStages = 0;
    this.stats.pendingStages = 0;

    this.projectsWithDoneStatus.forEach(project => {
      project.auditStages?.forEach(stage => {
        switch (stage.status.toLowerCase()) {
          case 'completed':
            this.stats.completedStages++;
            break;
          case 'in progress':
            this.stats.inProgressStages++;
            break;
          case 'assigned':
          case 'un-assigned':
            this.stats.pendingStages++;
            break;
        }
      });
    });
  }

  getProjectsWithOpportunityDone(): Project[] {
    return this.projectsWithDoneStatus;
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }

  trackByStageId(index: number, stage: AuditStage): number {
    return stage.id;
  }

  formatDate(dateString?: string | null): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getProjectStatusClass(status: string): string {
    const statusClass = status?.toLowerCase().replace(' ', '-') || 'unknown';
    return `project-row status-${statusClass}`;
  }

  canEditProject(project: Project): boolean {
    return this.userRole === 'admin' || (this.userRole === 'auditor' && project.status !== 'Completed');
  }

  viewAuditStages(project: Project): void {
    this.selectedProject = project;
  }

  closeAuditStagesModal(): void {
    this.selectedProject = null;
  }

  goBack(): void {
    this.location.back();
  }

  // Navigate to project details
  viewProjectDetails(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  // Navigate to create new project
  createNewProject(): void {
    this.router.navigate(['/projects/create'], {
      queryParams: { companyId: this.companyId }
    });
  }

  // Get project progress percentage
  getProjectProgress(project: Project): number {
    if (!project.auditStages || project.auditStages.length === 0) {
      return 0;
    }

    const completedStages = project.auditStages.filter(stage =>
        stage.status === 'Completed'
    ).length;

    return Math.round((completedStages / project.auditStages.length) * 100);
  }

  // Get next audit stage
  getNextAuditStage(project: Project): string {
    if (!project.auditStages || project.auditStages.length === 0) {
      return 'No stages defined';
    }

    const nextStage = project.auditStages.find(stage =>
        stage.status === 'Assigned' || stage.status === 'Un-Assigned'
    );

    return nextStage ? nextStage.stageType : 'All stages completed';
  }

  // Export projects to CSV (admin feature)
  exportProjects(): void {
    if (this.userRole !== 'admin') return;

    const csvContent = this.convertProjectsToCSV();
    this.downloadCSV(csvContent, `projects_company_${this.companyId}.csv`);
  }

  getStatusBadgeClass(status?: string): string {
    if (!status) return 'stage-status-unknown';
    switch(status.toLowerCase()) {
      case 'done':
      case 'completed': return 'stage-status-done';
      case 'in progress': return 'stage-status-in-progress';
      case 'assigned': return 'stage-status-assigned';
      default: return 'stage-status-unknown';
    }
  }

  private convertProjectsToCSV(): string {
    const headers = [
      'Project Name', 'Opportunity Name', 'Standard', 'Status',
      'Assigned Auditor', 'Created Date', 'Opportunity Status', 'Audit Code'
    ];

    const rows = this.projectsWithDoneStatus.map(project => [
      project.projectName || '',
      project.opportunity?.opportunityName || '',
      this.getOpportunityStandard(project),
      project.status,
      this.getOpportunityAssignedAuditor(project),
      this.formatDate(project.createdDate),
      this.getOpportunityStatus(project),
      this.getOpportunityAuditCode(project)
    ]);

    return [headers, ...rows].map(row =>
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  /!**
   * Get audit stage details for display
   *!/
  getAuditStageDetails(project: Project, stageType: string): AuditStage | null {
    if (!project || !project.auditStages || project.auditStages.length === 0) {
      return null;
    }

    return project.auditStages.find((s: AuditStage) =>
        s.stageType === stageType ||
        s.stageType === stageType.replace(/\s/g, '')
    ) || null;
  }

  /!**
   * Check if project has any audit stages
   *!/
  hasAuditStages(project: Project): boolean {
    return project && project.auditStages && project.auditStages.length > 0;
  }

  /!**
   * Refresh data
   *!/
  refreshData(): void {
    this.loadAllData();
  }

  /!**
   * Filter projects by status
   *!/
  filterProjectsByStatus(status: string): void {
    console.log('Filter by status:', status);
    // Implementation for filtering if needed
  }

  /!**
   * Get all stages for a project ordered by typical audit flow
   *!/
  getOrderedStages(project: Project): AuditStage[] {
    if (!this.hasAuditStages(project)) {
      return [];
    }

    const stageOrder = ['Stage 1', 'Stage 2', 'Surveillance 1', 'Surveillance 2', 'Re-certification'];

    return project.auditStages.sort((a, b) => {
      const indexA = stageOrder.indexOf(a.stageType);
      const indexB = stageOrder.indexOf(b.stageType);

      // If both stages are in the order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one stage is in the order array, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither stage is in the order array, maintain original order
      return 0;
    });
  }

  /!**
   * Check if any required documents are missing for contract phase
   *!/
  hasRequiredDocuments(project: Project): boolean {
    if (!project.opportunity) return false;

    const opportunity = project.opportunity;

    // Check for required contract documents using bracket notation
    return !!(
        opportunity['contractReviewPath'] &&
        this.hasSignedQuotationPath(opportunity) &&
        this.hasAuditProgramPath(opportunity)
    );
  }

  /!**
   * Get missing required documents
   *!/
  getMissingDocuments(project: Project): string[] {
    if (!project.opportunity) return ['All contract documents'];

    const opportunity = project.opportunity;
    const missing: string[] = [];

    if (!this.hasContractReviewPath(opportunity)) {
      missing.push('Contract Review Multistandard');
    }

    if (!this.hasSignedQuotationPath(opportunity)) {
      missing.push('Signed Quotation');
    }

    if (!this.hasAuditProgramPath(opportunity)) {
      missing.push('Audit Programme');
    }

    return missing;
  }

  /!**
   * Helper method to get projects from opportunity using bracket notation
   * This addresses the template access error
   *!/
  getProjectsFromOpportunity(opp: any): Project[] {
    return opp['projects'] || [];
  }

  /!**
   * Helper methods to safely access opportunity properties
   * These address TypeScript index signature access requirements
   *!/
  getOpportunityStandard(project: Project): string {
    return project.opportunity?.['standard'] || 'N/A';
  }

  getOpportunityAssignedAuditor(project: Project): string {
    return project.opportunity?.['assignedAuditor'] || 'Not assigned';
  }

  getOpportunityAuditCode(project: Project): string {
    return project.opportunity?.['auditCode'] || '';
  }

  getOpportunityStatus(project: Project): string {
    return project.opportunity?.['status'] || '';
  }

  hasSignedQuotationPath(opportunity: AuditOpportunity): boolean {
    return !!(opportunity?.['signedQuotationPath']);
  }

  hasContractReviewPath(opportunity: AuditOpportunity): boolean {
    return !!(opportunity?.['contractReviewPath']);
  }

  hasAuditProgramPath(opportunity: AuditOpportunity): boolean {
    return !!(opportunity?.['auditProgramPath']);
  }

  // Additional methods to add to your ProjectListComponent

  /!**
   * Get the 4 audit codes for the audit process
   *!/
  getStageNames(): string[] {
    return ['M1', 'S1', 'S2', 'M2'];
  }

  /!**
   * Generate stage code for a specific opportunity and stage
   *!/
  generateStageCode(opp: any, stageName: string): string {
    const companyPrefix = opp['company']?.['name']?.substring(0, 3).toUpperCase() || 'COM';
    const year = new Date().getFullYear();
    const opportunityId = opp['id'] || '001';

    // Generate code like: COM2025-001-M1
    return `${companyPrefix}${year}-${opportunityId.toString().padStart(3, '0')}-${stageName}`;
  }

  /!**
   * Get team leader for a specific stage
   *!/
  getTeamLeader(opp: any, stageName: string): string {
    const assignedAuditor = opp['assignedAuditor'] || 'TBD';
    return `Lead Auditor/Verifying Auditor - ${assignedAuditor}`;
  }

  /!**
   * Get audit team information for a stage
   *!/
  getAuditTeam(opp: any, stageName: string): string {
    // You can customize this based on your business logic
    const days = this.getQuotationDays(opp, stageName);
    return days ? `${days} day(s)` : 'N/A';
  }

  /!**
   * Get witness audit status for a stage
   *!/
  getWitnessAudit(opp: any, stageName: string): boolean {
    // This would typically come from your database
    // For now, returning false as default
    return false;
  }

  /!**
   * Get audit type for a stage
   *!/
  getAuditType(opp: any, stageName: string): string {
    // You can customize this based on your business logic
    return 'Onsite Audit';
  }

  /!**
   * Get quotation days for a stage
   *!/
  getQuotationDays(opp: any, stageName: string): number {
    // Customize based on audit code and opportunity data
    switch (stageName) {
      case 'M1': // Surveillance 1
        return 1;
      case 'S1': // Stage 1
        return 0.5;
      case 'S2': // Stage 2
        return 2;
      case 'M2': // Surveillance 2
        return 1;
      default:
        return 1;
    }
  }

  /!**
   * Get audit plan sent date
   *!/
  getAuditPlanSentDate(opp: any, stageName: string): string | null {
    // This should come from your database
    return opp[`${stageName.toLowerCase().replace(' ', '')}_auditPlanSentDate`] || null;
  }

  /!**
   * Get audit report sent date
   *!/
  getAuditReportSentDate(opp: any, stageName: string): string | null {
    // This should come from your database
    return opp[`${stageName.toLowerCase().replace(' ', '')}_auditReportSentDate`] || null;
  }

  /!**
   * Get handed for review date
   *!/
  getHandedForReviewDate(opp: any, stageName: string): string | null {
    // This should come from your database
    return opp[`${stageName.toLowerCase().replace(' ', '')}_handedForReviewDate`] || null;
  }

  /!**
   * Get submitted to CA date
   *!/
  getSubmittedToCaDate(opp: any, stageName: string): string | null {
    // This should come from your database
    return opp[`${stageName.toLowerCase().replace(' ', '')}_submittedToCaDate`] || null;
  }

  /!**
   * Get assigned days for a stage
   *!/
  getAssignedDays(opp: any, stageName: string): number {
    // This should come from your database
    return this.getQuotationDays(opp, stageName);
  }

  /!**
   * Get tentative dates
   *!/
  getTentativeDates(opp: any, stageName: string): string | null {
    // This should come from your database
    return opp[`${stageName.toLowerCase().replace(' ', '')}_tentativeDates`] || null;
  }

  /!**
   * Get confirmed dates
   *!/
  getConfirmedDates(opp: any, stageName: string): string | null {
    // This should come from your database
    return opp[`${stageName.toLowerCase().replace(' ', '')}_confirmedDates`] || null;
  }

  /!**
   * Get stage status
   *!/
  getStageStatus(opp: any, stageName: string): string {
    // This should come from your database
    const status = opp[`${stageName.toLowerCase().replace(' ', '')}_status`];
    return status || 'Assigned';
  }

  /!**
   * Get release date for completed stages
   *!/
  getReleaseDate(opp: any, stageName: string): string | null {
    if (this.getStageStatus(opp, stageName) === 'Completed') {
      return opp[`${stageName.toLowerCase().replace(' ', '')}_releaseDate`] || null;
    }
    return null;
  }

  /!**
   * Get certificate details
   *!/
  getCertificateDetails(opp: any, stageName: string): string | null {
    if (this.getStageStatus(opp, stageName) === 'Completed') {
      return opp[`${stageName.toLowerCase().replace(' ', '')}_certificateDetails`] || null;
    }
    return null;
  }

  /!**
   * Get payment notes
   *!/
  getPaymentNotes(opp: any, stageName: string): string | null {
    return opp[`${stageName.toLowerCase().replace(' ', '')}_paymentNotes`] || null;
  }

  /!**
   * Get project progress for an opportunity (percentage)
   *!/
  getProjectProgressForOpportunity(opp: any): number {
    const stages = this.getStageNames();
    const completedStages = stages.filter(stage =>
        this.getStageStatus(opp, stage) === 'Completed'
    ).length;

    return Math.round((completedStages / stages.length) * 100);
  }

  /!**
   * Get next action required for the project
   *!/
  getNextActionRequired(opp: any): string {
    const stages = this.getStageNames() as Array<'M1' | 'S1' | 'S2' | 'M2'>;

    for (const stage of stages) {
      const status = this.getStageStatus(opp, stage);
      if (status === 'Assigned' || status === 'In Progress') {
        const stageMap: Record<'M1' | 'S1' | 'S2' | 'M2', string> = {
          M1: 'Surveillance 1',
          S1: 'Stage 1',
          S2: 'Stage 2',
          M2: 'Surveillance 2'
        };
        return `Complete ${stageMap[stage]} (${stage})`;
      }
    }

    return 'No action required';
  }


  /!**
   * Action methods for the enhanced table
   *!/
  editStage(opp: any, stageName: string): void {
    console.log('Editing stage:', stageName, 'for opportunity:', opp.id);
    // Implement edit functionality
  }

  addPaymentDetails(opp: any, stageName: string): void {
    console.log('Adding payment details for stage:', stageName);
    // Implement payment details functionality
  }

  viewStageDetails(opp: any, stageName: string): void {
    console.log('Viewing details for stage:', stageName);
    // Implement view details functionality
  }

  downloadStageReport(opp: any, stageName: string): void {
    console.log('Downloading report for stage:', stageName);
    // Implement download report functionality
  }

  updateStageStatus(opp: any, stageName: string): void {
    console.log('Updating status for stage:', stageName);
    // Implement status update functionality
  }

  goToAuditPackage(opp: any, stageName: string): void {
    this.router.navigate(['/dashboard-auditor/audit-package/create', opp.id], {
      queryParams: { stage: stageName }
    });
  }

  goToAuditNote(opp: any, stageName: string): void {
    this.router.navigate(['/dashboard-auditor/audit-note/create', opp.id], {
      queryParams: { stage: stageName }
    });
  }

  goToRequestCertificate(opp: any, stageName: string): void {
    this.router.navigate(['/dashboard-auditor/certificate-request/create', opp.id], {
      queryParams: { stage: stageName }
    });
  }
}*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService, Project } from '../project.service';
import { FormsModule } from "@angular/forms";
import { Location } from '@angular/common';
import { OpportunityService, AuditOpportunity } from "../opportunity.service";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProjectListComponent implements OnInit {
  companyId!: number;
  companyName: string = '';
  projects: Project[] = [];
  auditStageProjects: Project[] = []; // New: Projects from backend with audit stages
  allOpportunities: AuditOpportunity[] = [];
  loading: boolean = true;
  selectedProject: Project | null = null;

  // Projects specifically with opportunity status 'Done'
  projectsWithDoneStatus: Project[] = [];

  // Statistics
  stats = {
    totalProjects: 0,
    completedStages: 0,
    inProgressStages: 0,
    pendingStages: 0
  };

  // User role for permissions
  userRole: string = localStorage.getItem('role') || 'auditor';
  opportunities: any[] = [];

  // New: Grouped projects by opportunity
  groupedProjects: { [key: number]: Project[] } = {};

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private projectService: ProjectService,
      private location: Location,
      private opportunityService: OpportunityService,
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
    this.companyName = this.route.snapshot.queryParamMap.get('companyName') || 'Unknown Company';
    this.loadAllData();
  }

  /**
   * Load all data concurrently including the new audit stage projects
   */
  loadAllData(): void {
    this.loading = true;

    forkJoin({
      projects: this.projectService.getProjectsByCompany(this.companyId),
      auditStageProjects: this.projectService.getProjectsWithAuditStagesByCompany(this.companyId),
      opportunities: this.opportunityService.getAllOpportunities()
    }).subscribe({
      next: (data) => {
        this.projects = data.projects || [];
        this.auditStageProjects = data.auditStageProjects || [];
        this.allOpportunities = data.opportunities || [];

        // Group audit stage projects by opportunity
        this.groupProjectsByOpportunity();

        // Filter projects with 'Done' opportunity status
        this.filterProjectsWithDoneStatus();

        // Update statistics
        this.updateStatistics();

        // Create projects for done opportunities if they don't exist
        this.createMissingProjects();

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Group audit stage projects by opportunity ID
   */
  groupProjectsByOpportunity(): void {
    this.groupedProjects = {};
    this.auditStageProjects.forEach(project => {
      if (project.opportunityId) {
        if (!this.groupedProjects[project.opportunityId]) {
          this.groupedProjects[project.opportunityId] = [];
        }
        this.groupedProjects[project.opportunityId].push(project);
      }
    });
  }

  /**
   * Create missing projects for opportunities with 'done' status
   */
  createMissingProjects(): void {
    const doneOpportunities = this.allOpportunities.filter(opp =>
        opp.status?.toLowerCase() === 'done' &&
        (opp as any).company?.id === this.companyId
    );

    doneOpportunities.forEach(opportunity => {
      // Check if projects already exist for this opportunity
      if (!this.groupedProjects[opportunity.id] || this.groupedProjects[opportunity.id].length === 0) {
        // Call backend to create projects for this opportunity
        this.projectService.createProjectsForCompletedOpportunity(opportunity.id).subscribe({
          next: (createdProjects) => {
            this.groupedProjects[opportunity.id] = createdProjects;
            this.updateStatistics();
          },
          error: (error) => {
            console.error('Error creating projects for opportunity:', opportunity.id, error);
          }
        });
      }
    });
  }

  /**
   * Filter projects that have opportunity with status 'Done'
   */
  filterProjectsWithDoneStatus(): void {
    this.projectsWithDoneStatus = this.projects.filter(project =>
        project.opportunity?.status?.toLowerCase() === 'done'
    );
  }

  updateStatistics(): void {
    let totalProjects = 0;
    let completedStages = 0;
    let inProgressStages = 0;
    let pendingStages = 0;

    Object.values(this.groupedProjects).forEach(projectGroup => {
      totalProjects += projectGroup.length;
      projectGroup.forEach(project => {
        switch (project.status?.toLowerCase()) {
          case 'completed':
            completedStages++;
            break;
          case 'in progress':
            inProgressStages++;
            break;
          case 'assigned':
          case 'un-assigned':
            pendingStages++;
            break;
        }
      });
    });

    this.stats = {
      totalProjects,
      completedStages,
      inProgressStages,
      pendingStages
    };
  }

  /**
   * Get opportunities with done status that have projects
   */
  getOpportunitiesWithDoneStatus(): any[] {
    return this.allOpportunities.filter(opp =>
        opp.status?.toLowerCase() === 'done' &&
        (opp as any).company?.id === this.companyId &&
        this.groupedProjects[opp.id] &&
        this.groupedProjects[opp.id].length > 0
    );
  }

  /**
   * Get projects for a specific opportunity
   */
  getProjectsForOpportunity(opportunityId: number): Project[] {
    return this.groupedProjects[opportunityId] || [];
  }

  /**
   * Get audit stage names in order
   */
  getStageNames(): string[] {
    return ['M1', 'S1', 'S2', 'M2'];
  }

  /**
   * Get project by audit code for a specific opportunity
   */
  getProjectByAuditCode(opportunityId: number, auditCode: string): Project | null {
    const projects = this.getProjectsForOpportunity(opportunityId);
    return projects.find(p => p.auditCode === auditCode) || null;
  }

  /**
   * Generate stage code for display
   */
  generateStageCode(opp: any, stageName: string): string {
    const companyPrefix = opp['company']?.['name']?.substring(0, 3).toUpperCase() || 'COM';
    const year = new Date().getFullYear();
    const opportunityId = opp['id'] || '001';
    return `${companyPrefix}${year}-${opportunityId.toString().padStart(3, '0')}-${stageName}`;
  }

  /**
   * Get team leader from project or opportunity
   */
  getTeamLeader(opportunityId: number, stageName: string): string {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.teamLeader || 'TBD';
  }

  /**
   * Get audit team information
   */
  getAuditTeam(opportunityId: number, stageName: string): string {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.auditTeam || 'N/A';
  }

  /**
   * Get witness audit status
   */
  getWitnessAudit(opportunityId: number, stageName: string): boolean {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.witnessAudit || false;
  }

  /**
   * Get audit type
   */
  getAuditType(opportunityId: number, stageName: string): string {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.auditType || 'Onsite Audit';
  }

  /**
   * Get quotation days
   */
  getQuotationDays(opportunityId: number, stageName: string): number {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.quotationDays || 1;
  }

  /**
   * Get assigned days
   */
  getAssignedDays(opportunityId: number, stageName: string): number {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.assignedDays || this.getQuotationDays(opportunityId, stageName);
  }

  /**
   * Get date fields
   */
  getAuditPlanSentDate(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.auditPlanSentDate ? new Date(project.auditPlanSentDate).toISOString() : null;
  }

  getAuditReportSentDate(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.auditReportSentDate ? new Date(project.auditReportSentDate).toISOString() : null;
  }

  getHandedForReviewDate(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.handedForReviewDate ? new Date(project.handedForReviewDate).toISOString() : null;
  }

  getSubmittedToCaDate(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.submittedToCaDate ? new Date(project.submittedToCaDate).toISOString() : null;
  }

  getTentativeDates(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.tentativeDates || null;
  }

  getConfirmedDates(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.confirmedDates || null;
  }

  /**
   * Get stage status
   */
  getStageStatus(opportunityId: number, stageName: string): string {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.status || 'Assigned';
  }

  /**
   * Get release date and certificate details for completed stages
   */
  getReleaseDate(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project?.status === 'Completed') {
      return project.releaseDate ? new Date(project.releaseDate).toISOString() : null;
    }
    return null;
  }

  getCertificateDetails(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project?.status === 'Completed') {
      return project.certificateDetails || null;
    }
    return null;
  }

  /**
   * Get payment notes
   */
  getPaymentNotes(opportunityId: number, stageName: string): string | null {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    return project?.paymentNotes || null;
  }

  /**
   * Get project progress for an opportunity
   */
  getProjectProgressForOpportunity(opportunityId: number): number {
    const projects = this.getProjectsForOpportunity(opportunityId);
    if (projects.length === 0) return 0;

    const completedStages = projects.filter(p => p.status === 'Completed').length;
    return Math.round((completedStages / projects.length) * 100);
  }

  /**
   * Get next action required
   */
  getNextActionRequired(opportunityId: number): string {
    const projects = this.getProjectsForOpportunity(opportunityId);
    const stageOrder = ['M1', 'S1', 'S2', 'M2'];

    for (const auditCode of stageOrder) {
      const project = projects.find(p => p.auditCode === auditCode);
      if (project && (project.status === 'Assigned' || project.status === 'In Progress')) {
        return `Complete ${project.stageType} (${auditCode})`;
      }
    }

    return 'All stages completed';
  }

  // Utility methods
  trackByStageName(index: number, stageName: string): number {
    return index; // ou stageName.hashCode si tu veux un identifiant unique
  }


  formatDate(dateString?: string | null): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getStatusBadgeClass(status?: string): string {
    if (!status) return 'badge-secondary';
    switch(status.toLowerCase()) {
      case 'completed': return 'badge-success';
      case 'in progress': return 'badge-warning';
      case 'assigned': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  canEditProject(project: Project): boolean {
    return this.userRole === 'admin' || (this.userRole === 'auditor' && project.status !== 'Completed');
  }

  goBack(): void {
    this.location.back();
  }

  refreshData(): void {
    this.loadAllData();
  }

  exportProjects(): void {
    if (this.userRole !== 'admin') return;

    const csvContent = this.convertProjectsToCSV();
    this.downloadCSV(csvContent, `projects_company_${this.companyId}.csv`);
  }

  private convertProjectsToCSV(): string {
    const headers = [
      'Opportunity Name', 'Audit Code', 'Stage Type', 'Status',
      'Team Leader', 'Audit Type', 'Quotation Days', 'Assigned Days'
    ];

    const rows: string[][] = [];
    Object.entries(this.groupedProjects).forEach(([opportunityId, projects]) => {
      projects.forEach(project => {
        rows.push([
          project.opportunityName || '',
          project.auditCode || '',
          project.stageType || '',
          project.status || '',
          project.teamLeader || '',
          project.auditType || '',
          (project.quotationDays || 0).toString(),
          (project.assignedDays || 0).toString()
        ]);
      });
    });

    return [headers, ...rows].map(row =>
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Action methods for the enhanced table
  editStage(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      console.log('Editing stage:', stageName, 'for project:', project.id);
      // Implement edit functionality
    }
  }

  addPaymentDetails(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      console.log('Adding payment details for project:', project.id);
      // Implement payment details functionality
    }
  }

  viewStageDetails(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      console.log('Viewing details for project:', project.id);
      // Implement view details functionality
    }
  }

  downloadStageReport(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      console.log('Downloading report for project:', project.id);
      // Implement download report functionality
    }
  }

  updateStageStatus(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      console.log('Updating status for project:', project.id);
      // Implement status update functionality
    }
  }

  goToAuditPackage(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      this.router.navigate(['/dashboard-auditor/audit-package/create', project.id], {
        queryParams: { stage: stageName }
      });
    }
  }

  goToAuditNote(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      this.router.navigate(['/dashboard-auditor/audit-note/create', project.id], {
        queryParams: { stage: stageName }
      });
    }
  }

  goToRequestCertificate(opportunityId: number, stageName: string): void {
    const project = this.getProjectByAuditCode(opportunityId, stageName);
    if (project) {
      this.router.navigate(['/dashboard-auditor/certificate-request/create', project.id], {
        queryParams: { stage: stageName }
      });
    }
  }
}
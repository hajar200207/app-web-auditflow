import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { NewSupplierAuditComponent } from '../new-supplier-audit/new-supplier-audit.component';
import {Project, ProjectService} from "../project.service";

interface Opportunity {
    id: number;
    standard: string;
    estimatedValue: number;
    salesRep: string;
    opportunityType: string;
    certificationBody: string;
    type: string;
    status: string;
    dateCreated: string;
    lastModified: string;
    companyId: number;
}

@Component({
    selector: 'app-company-detail',
    templateUrl: './company-detail.component.html',
    styleUrls: ['./company-detail.component.css'],
    standalone: true,
    imports: [NgIf, CommonModule, NewSupplierAuditComponent, RouterLink]
})
export class CompanyDetailComponent implements OnInit {
    companyId!: number;
    company: any;
    showAuditForm = false;
    opportunityCount = 0;
    projectCount = 0;
    doneOpportunities: Opportunity[] = [];
    showOpportunityModal = false;
    isConverting = false;
    projects: Project[] = [];
    loading: boolean = true;
    selectedProject: Project | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private projectService: ProjectService
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('companyId') || this.route.snapshot.paramMap.get('id');
        this.companyId = Number(id);

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        this.loadProjects();

        this.http.get(`http://localhost:8080/api/companies/${id}`, { headers })
            .subscribe({
                next: data => this.company = data,
                error: err => console.error('Error loading company details', err)
            });

        this.http.get<number>(`http://localhost:8080/api/opportunities/count/${id}`, { headers })
            .subscribe({
                next: count => this.opportunityCount = count,
                error: err => console.error('Error counting opportunities', err)
            });



        this.loadDoneOpportunities(Number(id));
    }

    loadDoneOpportunities(companyId: number) {
        this.http.get<Opportunity[]>(`http://localhost:8080/api/opportunities/company/${companyId}`,
            { headers: this.getHeaders() })
            .subscribe({
                next: opportunities => {
                    this.doneOpportunities = opportunities.filter(opp =>
                        opp.status.toLowerCase() === 'done' || opp.status.toLowerCase() === 'completed'
                    );

                    // Mettre à jour projectCount selon le nombre d'opportunités "done"
                    this.projectCount = this.doneOpportunities.length;

                    console.log('Done opportunities:', this.doneOpportunities);
                    console.log('Project count set to:', this.projectCount);
                },
                error: err => console.error('Error loading opportunities', err)
            });
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
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
    trackByProjectId(index: number, project: Project): number {
        return project.id;
    }

    // Format date for display


    // Get CSS class based on project status
    getProjectStatusClass(status: string): string {
        const statusClass = status.toLowerCase().replace(' ', '-');
        return `project-row status-${statusClass}`;
    }

    // Check if user can edit project


    // View audit stages modal
    viewAuditStages(project: Project): void {
        this.selectedProject = project;
    }

    // Close audit stages modal
    closeAuditStagesModal(): void {
        this.selectedProject = null;
    }

    // Navigation methods


    // Navigate to project details


    onAuditCreated() {
        this.showAuditForm = false;
        this.ngOnInit(); // Refresh company and count
    }

    // Show modal to select opportunity to convert
    showTurnOpportunityModal() {
        if (this.doneOpportunities.length === 0) {
            alert('No completed opportunities available to convert to project.');
            return;
        }
        this.showOpportunityModal = true;
    }

    // Close the opportunity selection modal
    closeOpportunityModal() {
        this.showOpportunityModal = false;
    }

    // Convert opportunity to project
    convertOpportunityToProject(opportunity: Opportunity) {
        if (this.isConverting) return;

        this.isConverting = true;

        this.projectService.createProjectFromOpportunity(opportunity.id)
            .subscribe({
                next: (project) => {
                    console.log('Project created successfully:', project);
                    this.showSuccessMessage('Opportunity converted to project successfully!');
                    this.closeOpportunityModal();

                    // Refresh counts
                    this.ngOnInit();

                    // Navigate to the new project details
                    this.router.navigate(['/dashboard-auditor/projects', project.id]);
                },
                error: (error) => {
                    console.error('Error creating project:', error);
                    this.showErrorMessage('Failed to convert opportunity to project. Please try again.');
                },
                complete: () => {
                    this.isConverting = false;
                }
            });
    }

    // Show success message
    private showSuccessMessage(message: string) {
        // You can implement a toast service here or use simple alert
        alert(message);
        // Or use a proper notification service:
        // this.notificationService.showSuccess(message);
    }

    // Show error message
    private showErrorMessage(message: string) {
        // You can implement a toast service here or use simple alert
        alert(message);
        // Or use a proper notification service:
        // this.notificationService.showError(message);
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

    // Format currency
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}
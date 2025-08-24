import { Routes } from '@angular/router';

// Core pages
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// Dashboards
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { DashboardAuditorComponent } from './dashboard-auditor/dashboard-auditor.component';

// Shared pages
import { CalendarComponent } from './calendar/calendar.component';
import { TasksComponent } from './tasks/tasks.component';
import { CompaniesInfoComponent } from './companies-info/companies-info.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { CompetitorsComponent } from './competitors/competitors.component';
import { ProductsInfoComponent } from './products-info/products-info.component';
import { ContactComponent } from './contact/contact.component';
import { SettingsComponent } from './settings/settings.component';
import { SalesPipelineComponent } from './sales-pipeline/sales-pipeline.component';

// Admin Modules
import { TopManagementComponent } from './top-management/top-management.component';
import { CertManagementComponent } from './cert-management/cert-management.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { SalesComponent } from './sales/sales.component';
import { ReviewersComponent } from './reviewers/reviewers.component';
import { AuditorsComponent } from './auditors/auditors.component';
import { ChangesManagementComponent } from './changes-management/changes-management.component';
import { FinanceComponent } from './finance/finance.component';
import { SfdaMainPageComponent } from './sfda-main-page/sfda-main-page.component';
import { AgentComponent } from './agent/agent.component';
import { CertificationReportsComponent } from './certification-reports/certification-reports.component';
import { GlobalPerformanceComponent } from './global-performance/global-performance.component';
import { CertificationSummaryComponent } from './certification-summary/certification-summary.component';
import { AuditsPerformanceSummaryComponent } from './audits-performance-summary/audits-performance-summary.component';
import { FinanceSummaryComponent } from './finance-summary/finance-summary.component';
import { FreelanceActivitiesComponent } from './freelance-activities/freelance-activities.component';
import { ActiveClientsListComponent } from './active-clients-list/active-clients-list.component';
import { ExternalReportsComponent } from './external-reports/external-reports.component';
import { AgentsAuditsTransfersComponent } from './agents-audits-transfers/agents-audits-transfers.component';
import { AgentsReportComponent } from './agents-report/agents-report.component';

// Training Modules
import { InstructorsListComponent } from './instructors-list/instructors-list.component';
import { MasterPlannerComponent } from './master-planner/master-planner.component';
import { ParticipantsLogComponent } from './participants-log/participants-log.component';
import { TrainingOperationsComponent } from './training-operations/training-operations.component';
import { TrainingReviewComponent } from './training-review/training-review.component';
import { TrainingReportsComponent } from './training-reports/training-reports.component';
import { TrainingMonthlyComponent } from './training-monthly/training-monthly.component';

// Strategy, Marketing & Leads
import { StrategyComponent } from './strategy/strategy.component';
import { MarketingComponent } from './marketing/marketing.component';
import { LeadsOpportunitiesComponent } from './leads-opportunities/leads-opportunities.component';
import { SearchComponent } from './search/search.component';

// Templates & Documentation
import { SalesTemplatesComponent } from './sales-templates/sales-templates.component';
import { AuditPackageTemplatesComponent } from './audit-package-templates/audit-package-templates.component';
import { GuidanceDocumentComponent } from './guidance-document/guidance-document.component';

// Other
import { ModuleDashboardComponent } from './module-dashboard/module-dashboard.component';
import { AuditorsCardsComponent } from './auditors-cards/auditors-cards.component';
import {PipelineDetailsComponent} from "./pipeline-details/pipeline-details.component";
import {ProjectListComponent} from "./project-list/project-list.component";
import {CreateAuditPackageComponent} from "./create-audit-package/create-audit-package.component";
import {CreateAuditNoteComponent} from "./create-audit-note/create-audit-note.component";
import {CreateCertificateRequestComponent} from "./create-certificate-request/create-certificate-request.component";

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    children: [
      { path: 'calendar', component: CalendarComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'top-management', component: TopManagementComponent },
      { path: 'cert-management', component: CertManagementComponent },
      { path: 'certificates', component: CertificatesComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'reviewers', component: ReviewersComponent },
      { path: 'auditors', component: AuditorsComponent },
      { path: 'changes-management', component: ChangesManagementComponent },
      { path: 'finance', component: FinanceComponent },
      { path: 'sfda-main-page', component: SfdaMainPageComponent },
      { path: 'agent', component: AgentComponent },
      { path: 'certification-reports', component: CertificationReportsComponent },
      { path: 'global-performance', component: GlobalPerformanceComponent },
      { path: 'certification-summary', component: CertificationSummaryComponent },
      { path: 'audits-performance-summary', component: AuditsPerformanceSummaryComponent },
      { path: 'finance-summary', component: FinanceSummaryComponent },
      { path: 'freelance-activities', component: FreelanceActivitiesComponent },
      { path: 'active-clients-list', component: ActiveClientsListComponent },
      { path: 'external-reports', component: ExternalReportsComponent },
      { path: 'agents-audits-transfers', component: AgentsAuditsTransfersComponent },
      { path: 'agents-report', component: AgentsReportComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'companies-info', component: CompaniesInfoComponent },
      { path: 'contacts-list', component: ContactsListComponent },
      { path: 'competitors', component: CompetitorsComponent },
      { path: 'products-info', component: ProductsInfoComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'module-dashboard', component: ModuleDashboardComponent },
      { path: 'auditors-cards', component: AuditorsCardsComponent },
      { path: 'instructors-list', component: InstructorsListComponent },
      { path: 'master-planner', component: MasterPlannerComponent },
      { path: 'participants-log', component: ParticipantsLogComponent },
      { path: 'training-operations', component: TrainingOperationsComponent },
      { path: 'training-review', component: TrainingReviewComponent },
      { path: 'training-reports', component: TrainingReportsComponent },
      { path: 'training-monthly', component: TrainingMonthlyComponent },
      { path: 'strategy', component: StrategyComponent },
      { path: 'marketing', component: MarketingComponent },
      { path: 'leads-opportunities', component: LeadsOpportunitiesComponent },
      { path: 'search', component: SearchComponent },
      { path: 'sales-templates', component: SalesTemplatesComponent },
      { path: 'audit-package-templates', component: AuditPackageTemplatesComponent },
      { path: 'guidance-document', component: GuidanceDocumentComponent },
      { path: 'companies-info/company-details/:id', component: CompanyDetailComponent },
    ]
  },
  { path: 'pipeline/:id', component: PipelineDetailsComponent },
  { path: 'pipeline/:id/:stage', component: PipelineDetailsComponent },


  {
    path: 'dashboard-auditor',
    component: DashboardAuditorComponent,
    children: [
      { path: 'calendar', component: CalendarComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'top-management', component: TopManagementComponent },
      { path: 'cert-management', component: CertManagementComponent },
      { path: 'certificates', component: CertificatesComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'reviewers', component: ReviewersComponent },
      { path: 'auditors', component: AuditorsComponent },
      { path: 'changes-management', component: ChangesManagementComponent },
      { path: 'finance', component: FinanceComponent },
      { path: 'sfda-main-page', component: SfdaMainPageComponent },
      { path: 'agent', component: AgentComponent },
      { path: 'certification-reports', component: CertificationReportsComponent },
      { path: 'global-performance', component: GlobalPerformanceComponent },
      { path: 'certification-summary', component: CertificationSummaryComponent },
      { path: 'audits-performance-summary', component: AuditsPerformanceSummaryComponent },
      { path: 'finance-summary', component: FinanceSummaryComponent },
      { path: 'freelance-activities', component: FreelanceActivitiesComponent },
      { path: 'active-clients-list', component: ActiveClientsListComponent },
      { path: 'external-reports', component: ExternalReportsComponent },
      { path: 'agents-audits-transfers', component: AgentsAuditsTransfersComponent },
      { path: 'agents-report', component: AgentsReportComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'companies-info', component: CompaniesInfoComponent },
      { path: 'companies-info/company-details/:id', component: CompanyDetailComponent },
      { path: 'contacts-list', component: ContactsListComponent },
      { path: 'competitors', component: CompetitorsComponent },
      { path: 'products-info', component: ProductsInfoComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'module-dashboard', component: ModuleDashboardComponent },
      { path: 'auditors-cards', component: AuditorsCardsComponent },
      { path: 'instructors-list', component: InstructorsListComponent },
      { path: 'master-planner', component: MasterPlannerComponent },
      { path: 'participants-log', component: ParticipantsLogComponent },
      { path: 'training-operations', component: TrainingOperationsComponent },
      { path: 'training-review', component: TrainingReviewComponent },
      { path: 'training-reports', component: TrainingReportsComponent },
      { path: 'training-monthly', component: TrainingMonthlyComponent },
      { path: 'strategy', component: StrategyComponent },
      { path: 'marketing', component: MarketingComponent },
      { path: 'leads-opportunities', component: LeadsOpportunitiesComponent },
      { path: 'search', component: SearchComponent },
      { path: 'sales-templates', component: SalesTemplatesComponent },
      { path: 'audit-package-templates', component: AuditPackageTemplatesComponent },
      { path: 'sales-pipeline', component: SalesPipelineComponent },
      { path: 'guidance-document', component: GuidanceDocumentComponent },
      { path: 'projects/:companyId', component: ProjectListComponent },
      { path: 'audit-package/create/:projectId', component: CreateAuditPackageComponent },
      { path: 'audit-note/create/:projectId', component: CreateAuditNoteComponent },
      { path: 'certificate-request/create/:projectId', component: CreateCertificateRequestComponent },



    ]
  },
];

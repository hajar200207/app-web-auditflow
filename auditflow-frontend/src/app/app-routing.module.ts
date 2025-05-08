import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { DashboardAuditorComponent } from './dashboard-auditor/dashboard-auditor.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TasksComponent } from './tasks/tasks.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    children: [
      { path: 'calendar', component: CalendarComponent },
      { path: 'tasks', component: TasksComponent }
    ]
  },
  { path: 'dashboard-customer', component: DashboardCustomerComponent },
  { path: 'dashboard-auditor', component: DashboardAuditorComponent }
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import {DashboardAdminComponent} from "./dashboard-admin/dashboard-admin.component";
import {DashboardCustomerComponent} from "./dashboard-customer/dashboard-customer.component";
import {DashboardAuditorComponent} from "./dashboard-auditor/dashboard-auditor.component";

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'dashboard-customer', component: DashboardCustomerComponent },
  { path: 'dashboard-auditor', component: DashboardAuditorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const appRoutes = routes;

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { DashboardAuditorComponent } from './dashboard-auditor/dashboard-auditor.component';

import { AppRoutingModule } from './app-routing.module';
import {LoginComponent} from "./login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {AddUserModalComponent} from "./add-user-modal/add-user-modal.component";
import {AuthInterceptor} from "./auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardAdminComponent,
    DashboardCustomerComponent,
    DashboardAuditorComponent,
    NavbarComponent,
    AddUserModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // ✅ CORRECT ici

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: AppComponent },       // Page d’accueil
  { path: 'login', component: LoginComponent } // Page login
];

@NgModule({
  declarations: [
    AppComponent,      // ✅ DOIT être ici si NON standalone
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule   //
  ],
  providers: [],
  bootstrap: [AppComponent] // ✅ OK si AppComponent N'EST PAS standalone
})
export class AppModule { }

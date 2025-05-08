import { Component } from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {LeftNavbarComponent} from "../left-navbar/left-navbar.components";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-dashboard-admin',
  imports: [
    NavbarComponent,
    LeftNavbarComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

}

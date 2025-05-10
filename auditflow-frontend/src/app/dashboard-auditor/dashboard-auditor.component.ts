import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LeftNavbarComponent} from "../left-navbar/left-navbar.components";
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterOutlet} from "@angular/router";


@Component({
  selector: 'app-dashboard-auditor',
  templateUrl: './dashboard-auditor.component.html',
  styleUrls: ['./dashboard-auditor.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, LeftNavbarComponent, NavbarComponent, RouterOutlet],
  providers: [DatePipe]
})
export class DashboardAuditorComponent {

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left-navbar.component.html',
  styleUrls: ['./left-navbar.component.css']
})
export class LeftNavbarComponent {
  active: string = '';
  userRole: string | null = null;

  constructor(private router: Router) {
    this.userRole = localStorage.getItem('role'); // get role from localStorage or AuthService
  }

  toggleSubmenu(section: string) {
    this.active = this.active === section ? '' : section;
  }

  navigateTo(path: string, section: string) {
    this.active = section;
    const basePath = this.userRole === 'admin' ? 'dashboard-admin' : 'dashboard-auditor';
    this.router.navigate([`/${basePath}/${path}`]);
  }
}


import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginPayload = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/api/auth/login', loginPayload).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        const decodedToken = JSON.parse(atob(response.token.split('.')[1]));
        const roles = decodedToken.roles.split(',');

        console.log('Roles:', decodedToken.roles);

        if (roles.includes('ROLE_ADMIN')) {
          localStorage.setItem('role', 'admin');
          this.router.navigate(['/dashboard-admin']);
        } else if (roles.includes('ROLE_CUSTOMER')) {
          localStorage.setItem('role', 'customer');
          this.router.navigate(['/dashboard-customer']);
        } else if (roles.includes('ROLE_AUDITOR')) {
          localStorage.setItem('role', 'auditor');
          this.router.navigate(['/dashboard-auditor']);
        } else {
          this.error = 'Role not recognized';
        }
      },
      error: () => {
        this.error = 'Invalid username or password';
      }
    });
  }
}

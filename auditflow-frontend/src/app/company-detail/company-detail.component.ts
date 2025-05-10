import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf, CommonModule } from '@angular/common';
import { NewSupplierAuditComponent } from '../new-supplier-audit/new-supplier-audit.component';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
  standalone: true,
  imports: [NgIf, CommonModule, NewSupplierAuditComponent, RouterLink]
})
export class CompanyDetailComponent implements OnInit {
  company: any;
  showAuditForm = false;
  opportunityCount = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

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
  }

  onAuditCreated() {
    this.showAuditForm = false;
    this.ngOnInit(); // Refresh company and count
  }
}

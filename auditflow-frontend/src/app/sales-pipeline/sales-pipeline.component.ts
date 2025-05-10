// // sales-pipeline.component.ts
// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {DatePipe, NgForOf, NgIf} from '@angular/common';
// import {FormsModule} from "@angular/forms";
//
// @Component({
//   selector: 'app-sales-pipeline',
//   templateUrl: './sales-pipeline.component.html',
//   styleUrls: ['./sales-pipeline.component.css'],
//   imports: [
//     NgIf,
//     NgForOf,
//     DatePipe,
//     FormsModule
//   ],
//   providers: [DatePipe]
// })
// export class SalesPipelineComponent implements OnInit {
//   stages = [
//     { key: 'Opportunity Review', label: 'Opportunity Review', number: '1' },
//     { key: 'Potential', label: 'Potential', number: '2' },
//     { key: 'Proposal', label: 'Proposal', number: '3' },
//     { key: 'Negotiation', label: 'Negotiation', number: '4' },
//     { key: 'Contract', label: 'Contract', number: '5' }
//   ];
//
//   opportunitiesByStage: { [key: string]: any[] } = {};
//
//   constructor(private http: HttpClient) {}
//
//   ngOnInit(): void {
//     this.fetchOpportunities();
//   }
//
//   fetchOpportunities() {
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
//
//     this.http.get<any[]>('http://localhost:8080/api/opportunities', { headers }).subscribe({
//       next: (data) => this.organizeByStage(data),
//       error: (err) => console.error('Failed to load opportunities:', err)
//     });
//   }
//
//   organizeByStage(opportunities: any[]) {
//     this.stages.forEach(stage => {
//       this.opportunitiesByStage[stage.key] = opportunities.filter(opp => opp.stage === stage.key);
//     });
//   }
//
//   getOpportunitiesByStage(stage: string) {
//     return this.opportunitiesByStage[stage] || [];
//   }
//
//   updateStage(opportunityId: number, newStage: string, newStatus: string) {
//     const token = localStorage.getItem('token');
//     const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
//
//     this.http.put(`http://localhost:8080/api/opportunities/${opportunityId}/stage`, {
//       stage: newStage,
//       status: newStatus
//     }, { headers }).subscribe({
//       next: () => this.fetchOpportunities(),
//       error: (err) => console.error('Error updating stage:', err)
//     });
//   }
// }
// sales-pipeline.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-sales-pipeline',
  templateUrl: './sales-pipeline.component.html',
  imports: [
    NgIf,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./sales-pipeline.component.css']
})
export class SalesPipelineComponent implements OnInit {
  stages = [
    { key: 'Opportunity Review', label: 'Opportunity Review', number: '1' },
    { key: 'Potential', label: 'Potential', number: '2' },
    { key: 'Proposal', label: 'Proposal', number: '3' },
    { key: 'Negotiation', label: 'Negotiation', number: '4' },
    { key: 'Contract', label: 'Contract', number: '5' }
  ];

  opportunitiesByStage: { [key: string]: any[] } = {};
  role = localStorage.getItem('role') || ''; // expected to be 'admin' for access

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOpportunities();
  }

  fetchOpportunities() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>('http://localhost:8080/api/opportunities', { headers }).subscribe({
      next: data => {
        data.forEach(opp => {
          opp.newStage = opp.stage; // for two-way binding
          opp.newStatus = opp.status;
        });
        this.organizeByStage(data);
      },
      error: err => console.error('Failed to load opportunities:', err)
    });
  }

  organizeByStage(opportunities: any[]) {
    this.stages.forEach(stage => {
      this.opportunitiesByStage[stage.key] = opportunities.filter(opp => opp.stage === stage.key);
    });
  }

  getOpportunitiesByStage(stage: string) {
    return this.opportunitiesByStage[stage] || [];
  }

  updateStage(opportunityId: number, newStage: string, newStatus: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(`http://localhost:8080/api/opportunities/${opportunityId}/stage`, {
      stage: newStage,
      status: newStatus
    }, { headers }).subscribe({
      next: () => this.fetchOpportunities(),
      error: err => console.error('Error updating stage:', err)
    });
  }
}

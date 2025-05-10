// companies-info.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForOf, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AddCompanyModalComponent } from '../add-company-modal/add-company-modal.component';
import {RouterLink} from "@angular/router";

export interface Company {
  id: number;
  name: string;
  address: string;
  country: string;
  sector: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-companies-info',
  standalone: true,
  templateUrl: './companies-info.component.html',
  styleUrls: ['./companies-info.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    NgForOf,
    NgIf,
    AddCompanyModalComponent,
    RouterLink
  ]
})
export class CompaniesInfoComponent implements OnInit {
  showModal = false;
  companies: Company[] = [];
  searchTerm = '';
  selectedCountry = '';
  selectedSector = '';
  countries: string[] = [];
  sectors: string[] = [];

  private apiUrl = 'http://localhost:8080/api/companies';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.countries = [...new Set(data.map(c => c.country))];
        this.sectors = [...new Set(data.map(c => c.sector))];
      },
      error: err => console.error('Error loading companies:', err)
    });
  }

  onCompanyCreated() {
    this.ngOnInit();
  }
  getCompanies(): Observable<Company[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Company[]>(this.apiUrl, { headers });
  }


  filteredCompanies(): Company[] {
    return this.companies.filter(company =>
        company.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (!this.selectedCountry || company.country === this.selectedCountry) &&
        (!this.selectedSector || company.sector === this.selectedSector)
    );
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.text('Companies List', 14, 15);
    const rows = this.filteredCompanies().map(c => [
      c.name, c.address, c.country, c.sector, c.phone, c.email
    ]);
    autoTable(doc, {
      head: [['Company', 'Address', 'Country', 'Sector', 'Phone', 'Email']],
      body: rows,
      startY: 20
    });
    doc.save('companies.pdf');
  }

  exportExcel() {
    const worksheetData = [
      ['Company', 'Address', 'Country', 'Sector', 'Phone', 'Email'],
      ...this.filteredCompanies().map(c => [
        c.name, c.address, c.country, c.sector, c.phone, c.email
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Companies');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'companies.xlsx');
  }

  print() {
    window.print();
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-company-modal',
  standalone: true,
  templateUrl: './add-company-modal.component.html',
  styleUrls: ['./add-company-modal.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AddCompanyModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() companyCreated = new EventEmitter<void>();

  company = {
    name: '',
    address: '',
    country: '',
    sector: '',
    phone: '',
    email: ''
  };

  constructor(private http: HttpClient) {}

  closeModal() {
    this.close.emit();
  }

  submitCompany() {
    this.http.post('http://localhost:8080/api/companies', this.company).subscribe({
      next: () => {
        this.companyCreated.emit();
        this.closeModal();
      },
      error: err => console.error('Error creating company:', err)
    });
  }
}

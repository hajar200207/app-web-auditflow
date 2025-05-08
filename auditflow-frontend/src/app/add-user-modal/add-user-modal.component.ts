import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HttpClient} from "@angular/common/http"; // si tu as des formulaires dans le popup

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent {
  @Output() onClose = new EventEmitter<void>();

  closeModal() {
    this.onClose.emit();
  }

  visible = true;
  user = {
    username: '',
    email: '',
    password: '',
    role: ''
  };
  error = '';

  constructor(private http: HttpClient) {}

  addUser() {
    this.http.post('http://localhost:8080/api/auth/register', this.user).subscribe({
      next: () => this.close(),
      error: () => this.error = 'terminer'
    });
  }

  close() {
    this.visible = false;
    this.onClose.emit();
  }
}

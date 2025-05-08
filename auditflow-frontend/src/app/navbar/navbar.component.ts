import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    CommonModule,           // ⬅️ Nécessaire pour *ngIf
    AddUserModalComponent
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showAddUserModal = false;
}

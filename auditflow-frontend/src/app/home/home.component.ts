import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showContactInfo(): void {
    alert('Contact Information:\nEmail: contact@excellencehub.ma\nPhone: +212 666 40 49 00\nAddress: Rabat, MOROCCO');
  }
}

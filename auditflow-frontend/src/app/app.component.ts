import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterLink,
        RouterOutlet
    ],
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'auditflow-frontend';

  showContactInfo() {
    alert("Contact Information:\nEmail: contact@excellencehub.ma\nPhone: +212 666 40 49 00\nAddress: Rabat, MOROCCO");
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'auditflow-frontend';

  showContactInfo() {
    alert("Contact Information:\nEmail: contact@excellencehub.ma\nPhone: +212 666 40 49 00\nAddress: Rabat, MOROCCO");
  }
}

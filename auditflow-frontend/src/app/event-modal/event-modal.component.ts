// import { Component, EventEmitter, Output } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
//
// @Component({
//   selector: 'app-event-modal',
//   standalone: true,
//   templateUrl: './event-modal.component.html',
//   styleUrls: ['./event-modal.component.css'],
//   imports: [CommonModule, FormsModule]
// })
// export class EventModalComponent {
//   @Output() close = new EventEmitter();
//   @Output() eventCreated = new EventEmitter<any>();
//
//   mode = 'Users';
//   selectedAttendees: any[] = [];
//   title = '';
//   description = '';
//   date = '';
//   start = '';
//   end = '';
//   isHoliday = false;
//   selectedType = '';
//   selectedCountry = '';
//
//   eventTypes = ['Audits', 'Trainings', 'Leaves', 'Others', 'Holiday', '4Es'];
//   countries = ['Morocco', 'France', 'Germany', 'USA', 'UAE'];
//   users: any[] = [];
//   groups = ['Certification Team', 'Sales Team', 'Top Management', 'Auditors', 'LB Auditors', 'KSA Auditors', 'Test Group'];
//
//   constructor(private http: HttpClient) {
//     this.loadUsers();
//   }
//
//   loadUsers() {
//     const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
//     this.http.get<any[]>('http://localhost:8080/api/users/', { headers }).subscribe(data => {
//       this.users = data;
//     });
//   }
//
//   submitEvent() {
//     const payload = {
//       title: this.title,
//       type: this.selectedType,
//       country: this.selectedCountry,
//       startTime: `${this.date}T${this.start}`,
//       endTime: `${this.date}T${this.end}`,
//       createdBy: this.mode === 'Users' ? { id: this.selectedAttendees[0] } : null,
//       eventGroup: this.mode === 'Groups' ? this.selectedAttendees.join(', ') : null,
//       description: this.description,
//       isHoliday: this.isHoliday
//     };
//
//     const token = localStorage.getItem('token');
//     const headers = { Authorization: `Bearer ${token}` };
//
//     this.http.post<any>('http://localhost:8080/api/calendar', payload, { headers }).subscribe({
//       next: (savedEvent) => {
//         this.eventCreated.emit({
//           title: savedEvent.title,
//           start: savedEvent.startTime,
//           end: savedEvent.endTime
//         });
//         this.close.emit();
//       },
//       error: (err) => {
//         console.error('❌ Error:', err);
//       }
//     });
//   }
//
// }
import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EventModalComponent {
  @Output() close = new EventEmitter();
  @Output() eventCreated = new EventEmitter<any>();

  mode = 'Users';
  selectedAttendees: any[] = [];
  title = '';
  description = '';
  date = '';
  start = '';
  end = '';
  isHoliday = false;
  selectedType = '';
  selectedCountry = '';

  eventTypes = ['Audits', 'Trainings', 'Leaves', 'Others', 'Holiday', '4Es'];
  countries = ['Morocco', 'France', 'Germany', 'USA', 'UAE'];
  users: any[] = [];
  groups = ['Certification Team', 'Sales Team', 'Top Management', 'Auditors', 'LB Auditors', 'KSA Auditors', 'Test Group'];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    this.http.get<any[]>('http://localhost:8080/api/users/', { headers }).subscribe(data => {
      this.users = data;
    });
  }

  submitEvent() {
    const payload = {
      title: this.title,
      type: this.selectedType,
      country: this.selectedCountry,
      description: this.description,
      startTime: `${this.date}T${this.start}`,
      endTime: `${this.date}T${this.end}`,
      group: this.mode === 'Groups' ? this.selectedAttendees[0] : null,
      createdBy: this.mode === 'Users' ? { id: this.selectedAttendees[0] } : null
    };

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post<any>('http://localhost:8080/api/calendar', payload, { headers }).subscribe({
      next: (savedEvent) => {
        this.eventCreated.emit({
          title: savedEvent.title,
          start: savedEvent.startTime,
          end: savedEvent.endTime,
          type: savedEvent.type

        });
        this.close.emit();
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }
}

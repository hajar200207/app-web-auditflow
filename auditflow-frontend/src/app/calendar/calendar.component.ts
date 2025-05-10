//
// import { Component, ViewChild } from '@angular/core';
// import { CalendarOptions } from '@fullcalendar/core';
// import { HttpClient } from '@angular/common/http';
// import { FullCalendarComponent } from '@fullcalendar/angular';
// import { FullCalendarModule } from '@fullcalendar/angular';
// import { FormsModule } from '@angular/forms';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import { CommonModule } from '@angular/common';
// import { EventModalComponent } from '../event-modal/event-modal.component';
//
// @Component({
//   selector: 'app-calendar',
//   standalone: true,
//   templateUrl: './calendar.component.html',
//   styleUrls: ['./calendar.component.css'],
//   imports: [
//     FullCalendarModule,
//     FormsModule,
//     CommonModule,
//     EventModalComponent
//   ]
// })
// export class CalendarComponent {
//   @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;
//
//   showEventModal = false;
//   selectedUser = '';
//   selectedCountry = '';
//   eventType = '';
//   showActionMenu = false;
//   users: any[] = [];
//
//   countries = ['Morocco', 'France', 'Germany'];
//   eventTypes = ['Audits', 'Trainings', 'Leaves', 'Others', 'Holiday', '4Es'];
//
//   constructor(private http: HttpClient) {
//     this.loadUsers();
//   }
//
//   calendarOptions: CalendarOptions = {
//     initialView: 'dayGridMonth',
//     plugins: [dayGridPlugin, timeGridPlugin],
//     headerToolbar: {
//       left: 'prev,next today',
//       center: 'title',
//       right: 'dayGridMonth,timeGridWeek,timeGridDay'
//     },
//
//     events: (info, successCallback, failureCallback) => {
//       const token = localStorage.getItem('token');
//       const headers = { Authorization: `Bearer ${token}` };
//       const start = info.startStr;
//       const end = info.endStr;
//
//       this.http.get<any[]>(`http://localhost:8080/api/calendar?start=${start}&end=${end}`, { headers }).subscribe({
//         next: events => {
//           successCallback(events.map(event => ({
//             title: event.title,
//             start: event.startTime,
//             end: event.endTime,
//             extendedProps: { type: event.type }
//           })));
//         },
//         error: error => {
//           console.error('Erreur de chargement des événements :', error);
//           failureCallback(error);
//         }
//       });
//     }
//   };
//
//   loadUsers() {
//     const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
//     this.http.get<any[]>('http://localhost:8080/api/users/', { headers }).subscribe(data => {
//       this.users = data;
//     });
//   }
//
//   loadFilteredEvents() {
//     const url = `http://localhost:8080/api/calendar?user=${this.selectedUser}&country=${this.selectedCountry}&type=${this.eventType}`;
//     const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
//     this.http.get<any[]>(url, { headers }).subscribe(events => {
//       const calendarApi = this.calendarComponent?.getApi();
//       calendarApi?.removeAllEvents();
//       events.forEach(event => {
//         calendarApi?.addEvent({
//           title: event.title,
//           start: event.startTime,
//           end: event.endTime,
//           extendedProps: { type: event.type }
//         });
//       });
//     });
//   }
//
//   toggleActionMenu() {
//     this.showActionMenu = !this.showActionMenu;
//   }
//
//   printCalendar() {
//     window.print();
//   }
//
//   openNewEventModal() {
//     this.showEventModal = true;
//   }
//
//   openNewLeaveModal() {}
//
//   addEventToCalendar(event: { title: string; start: string; end: string; type?: string }) {
//     const calendarApi = this.calendarComponent?.getApi();
//     calendarApi?.addEvent({
//       title: event.title,
//       start: event.start,
//       end: event.end,
//       extendedProps: { type: event.type }
//     });
//     this.showEventModal = false;
//   }
//
//
//   mapEventTypeToClass(type: string): string[] {
//     const map: { [key: string]: string } = {
//       'Audits': 'fc-event-audits',
//       'Trainings': 'fc-event-trainings',
//       'Leaves': 'fc-event-leaves',
//       'Others': 'fc-event-others',
//       'Holiday': 'fc-event-holiday',
//       '4Es': 'fc-event-4es'
//     };
//     return [map[type] || 'fc-event-others'];
//   }
//
// }
import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CommonModule } from '@angular/common';
import { EventModalComponent } from '../event-modal/event-modal.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [
    FullCalendarModule,
    FormsModule,
    CommonModule,
    EventModalComponent
  ]
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;

  showEventModal = false;
  selectedUser = '';
  selectedCountry = '';
  eventType = '';
  showActionMenu = false;
  users: any[] = [];

  countries = ['Morocco', 'France', 'Germany'];
  eventTypes = ['Audits', 'Trainings', 'Leaves', 'Others', 'Holiday', '4Es'];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  ngOnInit() {
    this.loadFilteredEvents(); // Charger tous les événements au démarrage
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [] // Désactivation du chargement automatique
  };

  loadUsers() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    this.http.get<any[]>('http://localhost:8080/api/users/', { headers }).subscribe(data => {
      this.users = data;
    });
  }

  loadFilteredEvents() {
    const url = `http://localhost:8080/api/calendar?user=${this.selectedUser}&country=${this.selectedCountry}&type=${this.eventType}`;
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.get<any[]>(url, { headers }).subscribe(events => {
      const calendarApi = this.calendarComponent?.getApi();
      calendarApi?.removeAllEvents();

      if (events.length === 0) {
        alert('No events found with the selected filters.');
        return;
      }

      events.forEach(event => {
        calendarApi?.addEvent({
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          extendedProps: { type: event.type }
        });
      });
    });
  }

  toggleActionMenu() {
    this.showActionMenu = !this.showActionMenu;
  }

  printCalendar() {
    window.print();
  }

  openNewEventModal() {
    this.showEventModal = true;
  }

  openNewLeaveModal() {}

  addEventToCalendar(event: { title: string; start: string; end: string; type?: string }) {
    const calendarApi = this.calendarComponent?.getApi();
    calendarApi?.addEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: { type: event.type }
    });
    this.showEventModal = false;
  }

  mapEventTypeToClass(type: string): string[] {
    const map: { [key: string]: string } = {
      'Audits': 'fc-event-audits',
      'Trainings': 'fc-event-trainings',
      'Leaves': 'fc-event-leaves',
      'Others': 'fc-event-others',
      'Holiday': 'fc-event-holiday',
      '4Es': 'fc-event-4es'
    };
    return [map[type] || 'fc-event-others'];
  }
}

import { Component, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { HttpClient } from '@angular/common/http';
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
export class CalendarComponent {
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;

  showEventModal = false;
  selectedUser = '';
  selectedCountry = '';
  eventType = '';
  showActionMenu = false;
  users: any[] = [];

  countries = ['Morocco', 'France', 'Germany'];
  eventTypes = ['Training', 'Audit', 'Leave'];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    events: 'http://localhost:8080/api/calendar',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    }
  };

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/api/users').subscribe(data => {
      this.users = data;
    });
  }

  loadFilteredEvents() {
    const url = `http://localhost:8080/api/calendar?user=${this.selectedUser}&country=${this.selectedCountry}&type=${this.eventType}`;
    this.http.get<any[]>(url).subscribe(events => {
      this.calendarOptions.events = events;
    });
  }

  toggleActionMenu() {
    this.showActionMenu = !this.showActionMenu;
  }

  printCalendar() {
    window.print();
  }

  openNewEventModal() {
    console.log('🔔 Modal opened');
    this.showEventModal = true;
  }

  openNewLeaveModal() {}

  addEventToCalendar(event: { title: string; start: string; end: string }) {
    const calendarApi = this.calendarComponent?.getApi();
    if (calendarApi) {
      calendarApi.addEvent({
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: false
      });
    } else {
      console.warn("Calendar API not found, fallback to reloading");
      this.loadFilteredEvents();
    }
  }
}

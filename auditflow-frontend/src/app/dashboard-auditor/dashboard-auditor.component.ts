import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Task {
  id: number;
  name: string;
  description: string;
}

interface NoteText {
  id: number;
  content: string;
}

interface ProgrammeAuditor {
  id: number;
  date: string;
  tasks: Task[];
  note: NoteText;
}

@Component({
  selector: 'app-dashboard-auditor',
  templateUrl: './dashboard-auditor.component.html',
  styleUrls: ['./dashboard-auditor.component.css']
})
export class DashboardAuditorComponent implements OnInit {
  programmes: ProgrammeAuditor[] = [];
  apiUrl = 'http://localhost:8080/api/programme-auditor/';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllProgrammes();
  }

  getAllProgrammes(): void {
    this.http.get<ProgrammeAuditor[]>(this.apiUrl).subscribe({
      next: data => this.programmes = data,
      error: err => console.error('Erreur de chargement', err)
    });
  }

  deleteProgramme(id: number): void {
    this.http.delete(this.apiUrl + id).subscribe({
      next: () => this.getAllProgrammes(),
      error: err => console.error('Erreur de suppression', err)
    });
  }
}


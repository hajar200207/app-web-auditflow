import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  imports: [FormsModule, NgIf, NgForOf]
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  users: any[] = [];
  showModal = false;

  taskForm = {
    id: null,
    name: '',
    description: '',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    editMode: false
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  openModal() {
    this.resetForm();
    this.showModal = true;
  }

  loadTasks() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    this.http.get<any[]>('http://localhost:8080/api/tasks', { headers }).subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Erreur de chargement des tâches', err)
    });
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/api/users/').subscribe(data => {
      this.users = data;
    });
  }

  submitTask() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };

    const payload = {
      name: this.taskForm.name,
      description: this.taskForm.description,
      type: this.taskForm.type,
      status: this.taskForm.status,
      startDate: this.taskForm.startDate,
      endDate: this.taskForm.endDate,
      assignedTo: { id: this.taskForm.assignedTo }
    };

    const url = this.taskForm.editMode
        ? `http://localhost:8080/api/tasks/${this.taskForm.id}`
        : 'http://localhost:8080/api/tasks';

    const request = this.taskForm.editMode
        ? this.http.put(url, payload, { headers })
        : this.http.post(url, payload, { headers });

    request.subscribe({
      next: () => {
        this.showModal = false;
        this.resetForm();
        this.loadTasks();
      },
      error: (err) => console.error('Erreur de sauvegarde', err)
    });
  }

  editTask(task: any) {
    this.taskForm = {
      id: task.id,
      name: task.name,
      description: task.description,
      type: task.type,
      status: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
      assignedTo: task.assignedTo?.id || '',
      editMode: true
    };
    this.showModal = true;
  }

  deleteTask(id: number) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.delete(`http://localhost:8080/api/tasks/${id}`, { headers }).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur de suppression', err)
    });
  }

  resetForm() {
    this.taskForm = {
      id: null,
      name: '',
      description: '',
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      assignedTo: '',
      editMode: false
    };
  }
}

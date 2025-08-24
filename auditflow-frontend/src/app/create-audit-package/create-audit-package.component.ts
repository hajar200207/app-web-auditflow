import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CommonModule, NgIf } from "@angular/common";

interface AuditPackageActivity {
  id: number;
  userId: number;
  activityType: string;
  fileName: string;
  timestamp: string;
  description: string;
}

@Component({
  selector: 'app-create-audit-package',
  templateUrl: './create-audit-package.component.html',
  imports: [
    NgIf,
    CommonModule
  ],
  styleUrls: ['./create-audit-package.component.css']
})
export class CreateAuditPackageComponent implements OnInit {
  selectedFile!: File;
  uploadedFileName = '';
  isLoading = false;
  userHistory: AuditPackageActivity[] = [];
  showHistory = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUserHistory();
  }

  // Récupérer le token JWT depuis le localStorage
  private getAuthToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Créer les en-têtes avec le token d'authentification
  private getHttpHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  downloadTemplate() {
    this.isLoading = true;
    const headers = this.getHttpHeaders();

    this.http.get('http://localhost:8080/api/audit-package/template', {
      headers: headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Universit.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Recharger l'historique après téléchargement
        this.loadUserHistory();
        alert('Template téléchargé avec succès!');
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du téléchargement du template:', error);
        if (error.status === 403) {
          alert('Accès refusé. Veuillez vous connecter.');
        } else if (error.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
        } else {
          alert('Erreur lors du téléchargement du template.');
        }
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const headers = this.getHttpHeaders();

    this.http.post('http://localhost:8080/api/audit-package/upload', formData, {
      headers: headers,
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.uploadedFileName = response;
        alert('Fichier uploadé avec succès!');
        this.loadUserHistory(); // Recharger l'historique
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors de l\'upload:', error);
        if (error.status === 403) {
          alert('Accès refusé. Veuillez vous connecter.');
        } else if (error.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
        } else {
          alert('Erreur lors de l\'upload du fichier.');
        }
        this.isLoading = false;
      }
    });
  }

  downloadUploadedFile() {
    if (!this.uploadedFileName) return;

    this.isLoading = true;
    const headers = this.getHttpHeaders();

    this.http.get(`http://localhost:8080/api/audit-package/download/${this.uploadedFileName}`, {
      headers: headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.uploadedFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.loadUserHistory(); // Recharger l'historique
        alert('Fichier téléchargé avec succès!');
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du téléchargement:', error);
        if (error.status === 403) {
          alert('Accès refusé. Veuillez vous connecter.');
        } else if (error.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
        } else {
          alert('Erreur lors du téléchargement du fichier.');
        }
        this.isLoading = false;
      }
    });
  }

  // Nouvelle méthode pour charger l'historique des activités
  loadUserHistory() {
    const headers = this.getHttpHeaders();

    this.http.get<AuditPackageActivity[]>('http://localhost:8080/api/audit-package/history', {
      headers: headers
    }).subscribe({
      next: (history) => {
        this.userHistory = history;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement de l\'historique:', error);
      }
    });
  }

  // Basculer l'affichage de l'historique
  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.loadUserHistory();
    }
  }

  // Formater la date pour l'affichage
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR');
  }
}
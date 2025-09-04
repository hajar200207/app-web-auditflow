import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from "@angular/common";

interface AuditPackageActivity {
  id: number;
  userId: number;
  activityType: string;
  fileName: string;
  timestamp: string;
  description: string;
  projectId?: number;
  stageName?: string;
}

interface ProjectInfo {
  id: number;
  opportunityName: string;
  auditCode: string;
  stageType: string;
  teamLeader: string;
  auditTeam: string;
  status: string;
  companyId: number;
  opportunityId: number;
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
  selectedFile: File | null = null;
  uploadedFileName = '';
  isLoading = false;
  userHistory: AuditPackageActivity[] = [];
  showHistory = false;

  // New properties for enhanced functionality
  projectId!: number;
  currentStage: string = '';
  projectInfo: ProjectInfo | null = null;
  documentType: 'report' | 'contract' = 'report';

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private router: Router
  ) {}

  ngOnInit() {
    // Debug: Check if token exists
    const token = this.getAuthToken();
    if (!token) {
      console.error('❌ No JWT token found in localStorage');
      alert('Authentication required. Please login again.');
      this.router.navigate(['/login']); // Adjust path as needed
      return;
    } else {
      console.log('✅ JWT token found:', token.substring(0, 50) + '...');
      // Debug: Decode token to check roles (for debugging only)
      this.debugTokenInfo(token);
    }

    // Récupération de projectId depuis la route
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('projectId');
      if (idParam) {
        this.projectId = +idParam;
        console.log('✅ Project ID from route:', this.projectId);
      } else {
        console.error('❌ Project ID not found in route');
        alert('Project ID not found. Cannot proceed.');
        return;
      }

      // Charger le projet seulement après avoir récupéré l'ID
      this.loadProjectInfo();
    });

    // Récupération du stage depuis queryParams
    this.route.queryParams.subscribe(params => {
      this.currentStage = params['stage'] || '';
      this.documentType = this.currentStage.toLowerCase().includes('contract') ? 'contract' : 'report';
      console.log('✅ Current stage:', this.currentStage, 'Document type:', this.documentType);
    });

    this.loadUserHistory();
  }

  private debugTokenInfo(token: string) {
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 Token payload:', payload);
      console.log('🔍 Token roles:', payload.roles || payload.authorities || 'No roles found');
      console.log('🔍 Token expiry:', new Date(payload.exp * 1000));

      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.error('❌ Token is expired!');
        alert('Session expired. Please login again.');
        this.router.navigate(['/login']);
        return;
      }
    } catch (error) {
      console.error('❌ Error decoding token:', error);
    }
  }

  private getAuthToken(): string {
    // Try multiple possible token storage keys
    const tokenKeys = ['token', 'authToken', 'jwt', 'accessToken'];

    for (const key of tokenKeys) {
      const token = localStorage.getItem(key);
      if (token) {
        console.log(`✅ Found token in localStorage key: ${key}`);
        return token;
      }
    }

    // Also check sessionStorage
    for (const key of tokenKeys) {
      const token = sessionStorage.getItem(key);
      if (token) {
        console.log(`✅ Found token in sessionStorage key: ${key}`);
        return token;
      }
    }

    console.error('❌ No token found in any storage location');
    return '';
  }

  private getHttpHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('🔍 Request headers:', {
      'Authorization': `Bearer ${token.substring(0, 20)}...`,
      'Content-Type': 'application/json'
    });

    return headers;
  }

  loadProjectInfo() {
    console.log('🔄 Loading project info for ID:', this.projectId);
    const headers = this.getHttpHeaders();

    this.http.get<ProjectInfo>(`http://localhost:8080/api/audit-package/project/${this.projectId}/info`, {
      headers: headers
    }).subscribe({
      next: (info) => {
        console.log('✅ Project info loaded successfully:', info);
        this.projectInfo = info;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error loading project info:', error);
        console.log('🔍 Error status:', error.status);
        console.log('🔍 Error body:', error.error);
        console.log('🔍 Error headers:', error.headers);

        if (error.status === 404) {
          alert('Project not found');
          this.router.navigate(['/dashboard-auditor']);
        } else if (error.status === 403) {
          alert('Access denied. Please check your permissions or login again.');
          // Optionally redirect to login
          this.router.navigate(['/login']);
        } else if (error.status === 401) {
          alert('Authentication failed. Please login again.');
          this.router.navigate(['/login']);
        } else {
          this.handleHttpError(error, 'loading project info');
        }
      }
    });
  }

  downloadTemplate() {
    if (!this.projectId || isNaN(this.projectId)) {
      alert('Project ID is not valid. Cannot download template.');
      console.error('❌ Invalid projectId:', this.projectId);
      return;
    }

    if (!this.projectInfo) {
      console.error('❌ Project info is null, attempting to load first...');
      // Try to load project info first
      this.loadProjectInfo();

      // Wait a moment and try again if still null
      setTimeout(() => {
        if (!this.projectInfo) {
          alert('Project information not loaded yet. Please try again in a moment.');
          return;
        }
        this.performDownloadTemplate();
      }, 2000);
      return;
    }

    this.performDownloadTemplate();
  }

  private performDownloadTemplate() {
    this.isLoading = true;
    const headers = this.getHttpHeaders();

    let url = `http://localhost:8080/api/audit-package/template/${this.projectId}`;
    if (this.currentStage) {
      url += `?stage=${encodeURIComponent(this.currentStage)}`;
    }

    console.log('🔄 Downloading template from:', url);

    this.http.get(url, {
      headers: headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        console.log('✅ Template downloaded successfully, blob size:', blob.size);
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;

        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const stageName = this.currentStage ? this.currentStage.replace(/[^a-zA-Z0-9]/g, '_') : 'document';
        const auditCode = this.projectInfo?.auditCode || 'unknown';

        a.download = this.documentType === 'contract'
            ? `Contract_${auditCode}_${stageName}_${timestamp}.docx`
            : `Audit_Report_${auditCode}_${stageName}_${timestamp}.docx`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);

        this.loadUserHistory();
        this.showSuccessMessage(`${this.getDocumentTypeLabel()} template downloaded successfully!`);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error downloading template:', err);
        this.handleHttpError(err, 'downloading template');
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      console.log('✅ File selected:', this.selectedFile.name, 'Size:', this.selectedFile.size);

      // Validate file type
      const allowedTypes = ['.docx', '.pdf', '.doc'];
      const fileExtension = this.selectedFile.name.substring(this.selectedFile.name.lastIndexOf('.')).toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        alert('Please select a valid document file (.docx, .pdf, or .doc)');
        this.selectedFile = null;
        return;
      }

      // Validate file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (this.selectedFile.size > maxSize) {
        alert('File size must be less than 10MB');
        this.selectedFile = null;
        return;
      }
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // For file upload, don't set Content-Type header - let browser set it with boundary
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let url = `http://localhost:8080/api/audit-package/upload/${this.projectId}`;
    if (this.currentStage) {
      url += `?stage=${encodeURIComponent(this.currentStage)}`;
    }

    console.log('🔄 Uploading file to:', url);

    this.http.post(url, formData, {
      headers: headers,
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('✅ File uploaded successfully:', response);
        this.uploadedFileName = response;
        this.showSuccessMessage('File uploaded successfully!');
        this.loadUserHistory();
        this.isLoading = false;

        // Reset file input
        const fileInput = document.getElementById('certificateFile') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        this.selectedFile = null;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error uploading file:', error);
        this.handleHttpError(error, 'uploading file');
        this.isLoading = false;
      }
    });
  }

  downloadUploadedFile() {
    if (!this.uploadedFileName) return;

    this.isLoading = true;
    const headers = this.getHttpHeaders();

    console.log('🔄 Downloading uploaded file:', this.uploadedFileName);

    this.http.get(`http://localhost:8080/api/audit-package/download/${this.uploadedFileName}`, {
      headers: headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        console.log('✅ Uploaded file downloaded successfully');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.uploadedFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.loadUserHistory();
        this.showSuccessMessage('File downloaded successfully!');
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error downloading file:', error);
        this.handleHttpError(error, 'downloading file');
        this.isLoading = false;
      }
    });
  }

  loadUserHistory() {
    console.log('🔄 Loading user history...');
    const headers = this.getHttpHeaders();

    this.http.get<AuditPackageActivity[]>('http://localhost:8080/api/audit-package/history', {
      headers: headers
    }).subscribe({
      next: (history) => {
        console.log('✅ User history loaded:', history.length, 'activities');
        this.userHistory = history;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error loading history:', error);
        // Don't show alert for history errors, just log them
        if (error.status === 403 || error.status === 401) {
          console.log('🔍 Authentication issue with history endpoint');
        }
      }
    });
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.loadUserHistory();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private handleHttpError(error: HttpErrorResponse, action: string) {
    let errorMessage = `Error ${action}.`;

    if (error.status === 403) {
      errorMessage = 'Access denied. Please check your permissions or login again.';
    } else if (error.status === 401) {
      errorMessage = 'Session expired. Please login again.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.status === 0) {
      errorMessage = 'Cannot connect to server. Please check if the server is running.';
    }

    alert(errorMessage);
  }

  private showSuccessMessage(message: string) {
    // You can replace this with a more sophisticated notification system
    alert(message);
  }

  goBack() {
    this.router.navigate(['/dashboard-auditor']);
  }

  getDocumentTypeLabel(): string {
    return this.documentType === 'contract' ? 'Contract' : 'Audit Report';
  }

  getStageDisplayName(): string {
    if (!this.currentStage) return 'Document';

    // Convert stage names to readable format
    return this.currentStage
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
  }


  // Add this to your ngOnInit() method or create a separate test method
  debugJWTToken() {
    console.log('=== JWT TOKEN DEBUG ===');

    // Check all possible storage locations
    const storageLocations = [
      { type: 'localStorage', key: 'token' },
      { type: 'localStorage', key: 'authToken' },
      { type: 'localStorage', key: 'jwt' },
      { type: 'localStorage', key: 'accessToken' },
      { type: 'sessionStorage', key: 'token' },
      { type: 'sessionStorage', key: 'authToken' },
    ];

    let foundToken = null;

    for (const location of storageLocations) {
      const storage = location.type === 'localStorage' ? localStorage : sessionStorage;
      const token = storage.getItem(location.key);
      if (token) {
        console.log(`✅ Found token in ${location.type}.${location.key}:`, token.substring(0, 50) + '...');
        foundToken = token;
        break;
      } else {
        console.log(`❌ No token in ${location.type}.${location.key}`);
      }
    }

    if (!foundToken) {
      console.log('❌ NO JWT TOKEN FOUND ANYWHERE');
      console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
      console.log('🔍 Available sessionStorage keys:', Object.keys(sessionStorage));
      return;
    }

    // Decode and analyze the token
    try {
      const parts = foundToken.split('.');
      if (parts.length !== 3) {
        console.log('❌ Invalid JWT format (should have 3 parts):', parts.length);
        return;
      }

      // Decode header
      const header = JSON.parse(atob(parts[0]));
      console.log('🔍 JWT Header:', header);

      // Decode payload
      const payload = JSON.parse(atob(parts[1]));
      console.log('🔍 JWT Payload:', payload);

      // Check expiration
      if (payload.exp) {
        const expirationDate = new Date(payload.exp * 1000);
        const now = new Date();
        console.log('🔍 Token expires at:', expirationDate);
        console.log('🔍 Current time:', now);
        console.log('🔍 Token is', expirationDate > now ? '✅ VALID' : '❌ EXPIRED');
      }

      // Check roles/authorities
      const roles = payload.roles || payload.authorities || payload.scope || [];
      console.log('🔍 User roles:', roles);

      // Check if roles match expected format
      const hasCorrectRoles = Array.isArray(roles) &&
          roles.some(role => role.includes('ROLE_AUDITOR') || role.includes('ROLE_ADMIN'));
      console.log('🔍 Has correct roles:', hasCorrectRoles ? '✅ YES' : '❌ NO');

      // Username
      console.log('🔍 Username:', payload.sub || payload.username || payload.user_name);

    } catch (error) {
      console.log('❌ Error decoding JWT token:', error);
      console.log('🔍 Token string:', foundToken);
    }

    console.log('=== END JWT DEBUG ===');
  }

// Test API call with detailed logging
  async testAPICall() {
    const token = this.getAuthToken();

    if (!token) {
      console.log('❌ No token for API test');
      return;
    }

    console.log('🔄 Testing API call with token...');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('🔍 Request headers:', headers);

    try {
      const response = await fetch(`http://localhost:8080/api/audit-package/project/5/info`, {
        method: 'GET',
        headers: headers
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', Array.from(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API call successful:', data);
      } else {
        const errorText = await response.text();
        console.log('❌ API call failed:', errorText);
      }
    } catch (error) {
      console.log('❌ Network error:', error);
    }
  }
}
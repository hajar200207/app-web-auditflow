import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {
  constructor(private http: HttpClient) {}

  getOpportunityById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<any>(`http://localhost:8080/api/opportunities/${id}`, { headers });
  }

}

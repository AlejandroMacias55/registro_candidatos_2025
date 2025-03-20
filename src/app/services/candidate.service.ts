import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'https://sistemas/registro_candidatura/api/v1/candidates'; // Ajusta esta URL según tu backend  localhost:3012

  constructor(private http: HttpClient) {}
  // Método para enviar un candidato al backend
  submitCandidate(candidate: Candidate): Observable<any> {
    return this.http.post<any>(this.apiUrl, candidate, { withCredentials: true });
  }
  // Método para traer info candidatos al fronted
  getCandidates(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/candidate';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private apiUrl = 'https://sistemas/registro_candidatura/api/v1/candidates'; //  produccion
  //private apiUrl = 'http://localhost:3012/registro_candidatura/api/v1/candidates'; //local

  constructor(private http: HttpClient) {}
  // Método para enviar un candidato al backend
  submitCandidate(candidate: Candidate): Observable<any> {
    return this.http.post<any>(this.apiUrl, candidate, { withCredentials: true });
  }
  // Método para traer info candidatos al fronted
  getCandidates(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { withCredentials: true });
  }

  // Método para actualizar un candidato por ID
  updateCandidate(id: number, candidateData: Partial<Candidate>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, candidateData, { withCredentials: true });
  }

  // Método para eliminar registro
  eliminarCandidato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  
}
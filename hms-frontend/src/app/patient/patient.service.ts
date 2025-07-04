import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  id?: number;
  fullName: string;
  dateOfBirth: string;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:5230/api/Patients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatientById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}

  createPatient(patient: any): Observable<any> {
  return this.http.post(this.apiUrl, patient);
}

  updatePatient(id: number, patient: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, patient);
}

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

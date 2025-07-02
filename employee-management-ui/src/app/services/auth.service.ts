// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class AuthService {
  // AuthService implementation
}

// DTO interfaces for type safety
export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface EmployeeDTO {
  id?: number;
  name: string;
  email: string;
  jobTitle: string;
  salary: number;
  departmentId: number;
}

export interface DepartmentDTO {
  id?: number;
  name: string;
  description?: string;
}

export interface LeaveDTO {
  id?: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PerformanceReviewDTO {
  id?: number;
  employeeId: number;
  reviewerId: number;
  reviewDate: string;
  comments: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7151/api';

  constructor(private http: HttpClient) {}

  // --- AUTH ---

  login(data: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/Auth/login`, data);
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, data);
  }

  // --- EMPLOYEE CRUD ---

  getEmployees(): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.apiUrl}/Employee`);
  }

  getEmployee(id: number): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(`${this.apiUrl}/Employee/${id}`);
  }

  createEmployee(data: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(`${this.apiUrl}/Employee`, data);
  }

  updateEmployee(id: number, data: EmployeeDTO): Observable<EmployeeDTO> {
    return this.http.put<EmployeeDTO>(`${this.apiUrl}/Employee/${id}`, data);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Employee/${id}`);
  }

  // --- DEPARTMENT CRUD ---

  getDepartments(): Observable<DepartmentDTO[]> {
    return this.http.get<DepartmentDTO[]>(`${this.apiUrl}/Department`);
  }

  getDepartment(id: number): Observable<DepartmentDTO> {
    return this.http.get<DepartmentDTO>(`${this.apiUrl}/Department/${id}`);
  }

  createDepartment(data: DepartmentDTO): Observable<DepartmentDTO> {
    return this.http.post<DepartmentDTO>(`${this.apiUrl}/Department`, data);
  }

  updateDepartment(id: number, data: DepartmentDTO): Observable<DepartmentDTO> {
    return this.http.put<DepartmentDTO>(`${this.apiUrl}/Department/${id}`, data);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Department/${id}`);
  }

  // --- LEAVE CRUD ---

  getLeaves(): Observable<LeaveDTO[]> {
    return this.http.get<LeaveDTO[]>(`${this.apiUrl}/Leave`);
  }

  getLeave(id: number): Observable<LeaveDTO> {
    return this.http.get<LeaveDTO>(`${this.apiUrl}/Leave/${id}`);
  }

  createLeave(data: LeaveDTO): Observable<LeaveDTO> {
    return this.http.post<LeaveDTO>(`${this.apiUrl}/Leave`, data);
  }

  updateLeave(id: number, data: LeaveDTO): Observable<LeaveDTO> {
    return this.http.put<LeaveDTO>(`${this.apiUrl}/Leave/${id}`, data);
  }

  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Leave/${id}`);
  }

  // --- PERFORMANCE REVIEW CRUD ---

  getPerformanceReviews(): Observable<PerformanceReviewDTO[]> {
    return this.http.get<PerformanceReviewDTO[]>(`${this.apiUrl}/PerformanceReview`);
  }

  getPerformanceReview(id: number): Observable<PerformanceReviewDTO> {
    return this.http.get<PerformanceReviewDTO>(`${this.apiUrl}/PerformanceReview/${id}`);
  }

  createPerformanceReview(data: PerformanceReviewDTO): Observable<PerformanceReviewDTO> {
    return this.http.post<PerformanceReviewDTO>(`${this.apiUrl}/PerformanceReview`, data);
  }

  updatePerformanceReview(id: number, data: PerformanceReviewDTO): Observable<PerformanceReviewDTO> {
    return this.http.put<PerformanceReviewDTO>(`${this.apiUrl}/PerformanceReview/${id}`, data);
  }

  deletePerformanceReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/PerformanceReview/${id}`);
  }

  // You can add more services like FileUpload, AuditLog similarly...
}

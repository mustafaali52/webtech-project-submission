import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for request/response data
export interface UserRegistration {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  // you can add other fields returned on login
}

export interface Department {
  id?: number;
  name: string;
  description?: string;
}

export interface Employee {
  id?: number;
  name: string;
  email: string;
  position: string;
  departmentId?: number;
  phone?: string;
  // add fields as your API requires
}

export interface LeaveRequest {
  id?: number;
  employeeId?: number;
  startDate: string;
  endDate: string;
  reason: string;
  status?: string; // Pending, Approved, Rejected etc
}

export interface PerformanceReview {
  id?: number;
  employeeId: number;
  managerId?: number;
  reviewDate: string;
  comments: string;
  rating: number; // scale 1-5 or whatever your API uses
}

export interface FileUploadResponse {
  id: number;
  fileName: string;
  url: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: number;
  action: string;
  userId: number;
  timestamp: string;
  details?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://localhost:7151/api';

  constructor(private http: HttpClient) {}

  // -------- AUTHENTICATION --------
  register(user: UserRegistration): Observable<any> {
    return this.http.post(`${this.baseUrl}/Auth/register`, user);
  }

  login(credentials: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/Auth/login`, credentials);
  }

  // -------- DEPARTMENT --------
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/Department`);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/Department/${id}`);
  }

  createDepartment(dept: Department): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/Department`, dept);
  }

  updateDepartment(id: number, dept: Department): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/Department/${id}`, dept);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Department/${id}`);
  }

  // -------- EMPLOYEE --------
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/Employee`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/Employee/${id}`);
  }

  createEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/Employee`, emp);
  }

  updateEmployee(id: number, emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/Employee/${id}`, emp);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Employee/${id}`);
  }

  // -------- FILE UPLOAD --------
  uploadFile(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileUploadResponse>(`${this.baseUrl}/FileUpload`, formData);
  }

  getEmployeeFiles(employeeId: number): Observable<FileUploadResponse[]> {
    return this.http.get<FileUploadResponse[]>(`${this.baseUrl}/FileUpload/employee/${employeeId}`);
  }

  deleteFile(fileId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/FileUpload/${fileId}`);
  }

  // -------- LEAVE --------
  submitLeaveRequest(leave: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/Leave`, leave);
  }

  getLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/Leave`);
  }

  getLeaveById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.baseUrl}/Leave/${id}`);
  }

  approveRejectLeave(id: number, status: 'Approved' | 'Rejected'): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.baseUrl}/Leave/${id}`, { status });
  }

  deleteLeave(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Leave/${id}`);
  }

  // -------- PERFORMANCE REVIEW --------
  submitReview(review: PerformanceReview): Observable<PerformanceReview> {
    return this.http.post<PerformanceReview>(`${this.baseUrl}/PerformanceReview`, review);
  }

  getReviews(): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>(`${this.baseUrl}/PerformanceReview`);
  }

  getReviewsByEmployee(employeeId: number): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>(`${this.baseUrl}/PerformanceReview/employee/${employeeId}`);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/PerformanceReview/${id}`);
  }

  // -------- AUDIT LOG --------
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/AuditLog`);
  }
}

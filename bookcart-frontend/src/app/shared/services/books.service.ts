import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  bookId: number;
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  categoryName: string;
  stockQuantity: number;
  createdDate: string;
  isActive: boolean;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  stockQuantity: number;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: number;
  stockQuantity?: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private readonly API_URL = 'http://localhost:5003/api';

  constructor(private http: HttpClient) { }

  // Get all books
  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.API_URL}/books`);
  }

  // Get book by ID
  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/books/${id}`);
  }

  // Search books
  searchBooks(searchTerm: string): Observable<Book[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<Book[]>(`${this.API_URL}/books/search`, { params });
  }

  // Get books by category
  getBooksByCategory(categoryId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.API_URL}/books/category/${categoryId}`);
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  // Admin: Create book
  createBook(book: CreateBookRequest): Observable<Book> {
    return this.http.post<Book>(`${this.API_URL}/books`, book);
  }

  // Admin: Update book
  updateBook(id: number, book: UpdateBookRequest): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/books/${id}`, book);
  }

  // Admin: Delete book
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/books/${id}`);
  }
}

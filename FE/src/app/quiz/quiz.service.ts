import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { QuizDto, QuizCreateResponse } from '../shared/models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createQuiz(quizDto: QuizDto): Observable<QuizCreateResponse> {
    return this.http.post<QuizCreateResponse>(`${this.apiUrl}/teacher/quiz/create`, quizDto)
      .pipe(
        catchError(error => {
          console.error('Create quiz error:', error);
          return throwError(() => new Error('Failed to create quiz. Please try again.'));
        })
      );
  }
}
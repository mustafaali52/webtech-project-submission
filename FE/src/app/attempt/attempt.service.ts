import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import {
    JoinQuizDto,
    QuizDataDto,
    SubmitQuizDto,
    QuizResultDto,
    AttemptHistoryDto
} from '../shared/models/student-quiz';

@Injectable({
    providedIn: 'root'
})
export class StudentQuizService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    joinQuiz(joinQuizDto: JoinQuizDto): Observable<QuizDataDto> {
        return this.http.post<QuizDataDto>(`${this.apiUrl}/student/quiz/join`, joinQuizDto)
            .pipe(
                catchError(error => {
                    console.error('Join quiz error:', error);
                    let errorMessage = 'Failed to join quiz. Please try again.';
                    if (error.status === 404) {
                        errorMessage = 'Quiz not found. Please check the password.';
                    } else if (error.status === 400) {
                        errorMessage = 'You have already attempted this quiz.';
                    }
                    return throwError(() => new Error(errorMessage));
                })
            );
    }

    submitQuiz(submitQuizDto: SubmitQuizDto): Observable<QuizResultDto> {
        return this.http.post<QuizResultDto>(`${this.apiUrl}/student/quiz/submit`, submitQuizDto)
            .pipe(
                catchError(error => {
                    console.error('Submit quiz error:', error);
                    let errorMessage = 'Failed to submit quiz. Please try again.';
                    if (error.status === 400) {
                        errorMessage = 'You have already attempted this quiz.';
                    } else if (error.status === 404) {
                        errorMessage = 'Quiz not found.';
                    }
                    return throwError(() => new Error(errorMessage));
                })
            );
    }

    getMyAttempts(): Observable<AttemptHistoryDto[]> {
        return this.http.get<AttemptHistoryDto[]>(`${this.apiUrl}/student/quiz/attempts`)
            .pipe(
                catchError(error => {
                    console.error('Get attempts error:', error);
                    return throwError(() => new Error('Failed to fetch your quiz attempts. Please try again.'));
                })
            );
    }
}
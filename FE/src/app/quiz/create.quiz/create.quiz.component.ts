import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { QuizService } from '../quiz.service';
import { QuizDto, Question } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-quiz-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './create.quiz.component.html',
  styleUrl: './create.quiz.component.css'
})
export class QuizCreateComponent {
  errorMessage = '';
  successMessage = '';
  quizForm: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      password: [''],
      questions: this.fb.array([])
    });
    
    // Add initial question
    this.addQuestion();
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestionGroup(): ReturnType<FormBuilder['group']> {
    return this.fb.group({
      questionText: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      correctOption: [1, [Validators.required, Validators.min(1), Validators.max(4)]]
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    const formValue = this.quizForm.value;
    const quizDto: QuizDto = {
      title: formValue.title,
      password: formValue.password || undefined,
      questions: formValue.questions
    };
    console.log(quizDto)

    this.quizService.createQuiz(quizDto).subscribe({
      next: (response) => {
        this.successMessage = 'Quiz created successfully!';
        setTimeout(() => {
          this.router.navigate(['unauthorize']);
        }, 2000);
      },
      error: (error) => {
        console.log('Quiz creation failed:', error);
        this.errorMessage = 'Failed to create quiz. Please try again.';
      }
    });
  }
}
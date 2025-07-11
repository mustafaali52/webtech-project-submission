import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { StudentQuizService } from '../attempt.service';
import { 
  JoinQuizDto, 
  QuizDataDto, 
  SubmitQuizDto, 
  QuizResultDto, 
  AnswerDto 
} from '../../shared/models/student-quiz';

@Component({
  selector: 'app-student-quiz',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatProgressBarModule,
    MatStepperModule
  ],
  templateUrl: './attempt.quiz.component.html',
  styleUrl: './attempt.quiz.component.css'
})
export class StudentQuizComponent implements OnInit {
  // Form states
  joinForm: FormGroup;
  quizForm: FormGroup;
  
  // Component states
  currentStep: 'join' | 'quiz' | 'result' = 'join';
  currentQuestionIndex = 0;
  
  // Data
  quizData: QuizDataDto | null = null;
  quizResult: QuizResultDto | null = null;
  selectedAnswers: { [questionId: number]: number } = {};
  
  // UI states
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private studentQuizService: StudentQuizService,
    private router: Router
  ) {
    this.joinForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.quizForm = this.fb.group({
      selectedOption: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.resetMessages();
  }

  get currentQuestion() {
    return this.quizData?.questions[this.currentQuestionIndex] || null;
  }

  get progress() {
    if (!this.quizData) return 0;
    return ((this.currentQuestionIndex + 1) / this.quizData.totalQuestions) * 100;
  }

  get isLastQuestion() {
    return this.quizData ? this.currentQuestionIndex === this.quizData.questions.length - 1 : false;
  }

  get hasAnsweredCurrentQuestion() {
    return this.currentQuestion ? this.selectedAnswers[this.currentQuestion.id] !== undefined : false;
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onJoinQuiz(): void {
    if (this.joinForm.invalid) {
      this.errorMessage = 'Please enter a valid password';
      return;
    }

    this.loading = true;
    this.resetMessages();

    const joinQuizDto: JoinQuizDto = {
      password: this.joinForm.value.password
    };

    this.studentQuizService.joinQuiz(joinQuizDto).subscribe({
      next: (response) => {
        this.quizData = response;
        this.currentStep = 'quiz';
        this.currentQuestionIndex = 0;
        this.selectedAnswers = {};
        this.loading = false;
        this.successMessage = `Successfully joined quiz: ${response.title}`;
        
        // Set initial form state
        this.updateQuizForm();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }

  updateQuizForm(): void {
    if (this.currentQuestion) {
      const currentAnswer = this.selectedAnswers[this.currentQuestion.id];
      this.quizForm.patchValue({
        selectedOption: currentAnswer || ''
      });
    }
  }

  onAnswerSelect(option: number): void {
    if (this.currentQuestion) {
      this.selectedAnswers[this.currentQuestion.id] = option;
      this.quizForm.patchValue({ selectedOption: option });
    }
  }

  onNextQuestion(): void {
    if (this.currentQuestion && this.quizForm.valid) {
      const selectedOption = this.quizForm.value.selectedOption;
      this.selectedAnswers[this.currentQuestion.id] = selectedOption;
      
      if (this.isLastQuestion) {
        this.onSubmitQuiz();
      } else {
        this.currentQuestionIndex++;
        this.updateQuizForm();
      }
    }
  }

  onPreviousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateQuizForm();
    }
  }

  onSubmitQuiz(): void {
    if (!this.quizData) return;

    // Ensure current question is saved
    if (this.currentQuestion && this.quizForm.valid) {
      const selectedOption = this.quizForm.value.selectedOption;
      this.selectedAnswers[this.currentQuestion.id] = selectedOption;
    }

    this.loading = true;
    this.resetMessages();

    const answers: AnswerDto[] = Object.entries(this.selectedAnswers).map(([questionId, selectedOption]) => ({
      questionId: parseInt(questionId),
      selectedOption: selectedOption
    }));

    const submitQuizDto: SubmitQuizDto = {
      quizId: this.quizData.quizId,
      answers: answers
    };

    this.studentQuizService.submitQuiz(submitQuizDto).subscribe({
      next: (response) => {
        this.quizResult = response;
        this.currentStep = 'result';
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }

  onRetakeQuiz(): void {
    this.currentStep = 'join';
    this.currentQuestionIndex = 0;
    this.quizData = null;
    this.quizResult = null;
    this.selectedAnswers = {};
    this.joinForm.reset();
    this.quizForm.reset();
    this.resetMessages();
  }

  onViewHistory(): void {
    this.router.navigate(['history']);
  }

  getScoreColor(): string {
    if (!this.quizResult) return 'primary';
    
    const percentage = this.quizResult.percentage;
    if (percentage >= 80) return 'primary';
    if (percentage >= 60) return 'accent';
    return 'warn';
  }

  getScoreIcon(): string {
    if (!this.quizResult) return 'help';
    
    const percentage = this.quizResult.percentage;
    if (percentage >= 80) return 'sentiment_very_satisfied';
    if (percentage >= 60) return 'sentiment_satisfied';
    return 'sentiment_dissatisfied';
  }
}
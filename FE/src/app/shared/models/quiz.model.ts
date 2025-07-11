export interface Quiz {
  id: number;
  title: string;
  totalQuestions: number;
  teacherId: number;
  password?: string;
}

export interface Question {
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
}

export interface QuizDto {
  title: string;
  password?: string;
  questions: Question[];
}

export interface QuizCreateResponse {
  message: string;
  quizId: number;
}
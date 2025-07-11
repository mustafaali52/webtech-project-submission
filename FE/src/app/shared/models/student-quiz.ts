export interface JoinQuizDto {
  password: string;
}

export interface QuizDataDto {
  quizId: number;
  title: string;
  totalQuestions: number;
  questions: QuestionDataDto[];
}

export interface QuestionDataDto {
  id: number;
  questionText: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface SubmitQuizDto {
  quizId: number;
  answers: AnswerDto[];
}

export interface AnswerDto {
  questionId: number;
  selectedOption: number;
}

export interface QuizResultDto {
  score: number;
  totalQuestions: number;
  percentage: number;
}

export interface AttemptHistoryDto {
  id: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}
export interface Question {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
  id: string;
}

export type Answer = string[];

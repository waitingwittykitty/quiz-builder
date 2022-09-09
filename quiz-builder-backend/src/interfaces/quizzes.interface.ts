export type Answer = number | number[];

export interface Question {
  question: string;
  type: 'single' | 'multiple';
  answers: string[];
  correctAnswer: Answer;
}

export interface Quiz {
  _id: string;
  author: string;
  permalink: string;
  title: string;
  questions: Question[];
  getPublicData: () => PublicQuiz;
}

export type PublicQuestion = Omit<Question, 'correctAnswer'>;

export interface PublicQuiz
  extends Omit<Quiz, '_id' | 'author' | 'questions' | 'getPublicData'> {
  questions: PublicQuestion[];
}

export interface CheckResult {
  total: number;
  score: number;
}

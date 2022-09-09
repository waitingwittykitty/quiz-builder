import React, { createContext, useState, useContext } from 'react';

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
}

export type PublicQuestion = Omit<Question, 'correctAnswer'>;

export interface PublicQuiz
  extends Omit<Quiz, '_id' | 'author' | 'questions' | 'getPublicData'> {
  questions: PublicQuestion[];
}

export interface QuizQuery {
  page: number;
  perPage: number;
}

const QuizContext = createContext<{
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}>({
  quizzes: [],
  setQuizzes: () => {},
  total: 0,
  setTotal: () => {},
});

export interface QuizContextProviderProps {
  children: React.ReactNode;
}

export const QuizContextProvider = ({ children }: QuizContextProviderProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [total, setTotal] = useState(0);

  return (
    <QuizContext.Provider value={{ total, setTotal, quizzes, setQuizzes }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);

  return context;
};

export default QuizContext;

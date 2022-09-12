import { useState } from 'react';

import { Answer, PublicQuiz } from '../../context/quiz-context';
import Core from './quiz-core';

import './styles.scss';

export interface QuizProps {
  quiz: PublicQuiz;
  onComplete: (result: { answer: Answer[] }) => void;
  result: {
    total: number;
    score: number;
  } | null;
}

const QuizContest = function ({ quiz, onComplete, result }: QuizProps) {
  const [start, setStart] = useState(false);
  const { questions } = quiz;
  const questionCount = questions.length;

  return (
    <div className="quiz-contest">
      {!start && (
        <div>
          <h2>{quiz.title}</h2>
          <div className="description">{questionCount} Questions</div>
          <div>
            <button onClick={() => setStart(true)} className="btn btn-primary">
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {start && <Core quiz={quiz} onSubmit={onComplete} result={result} />}
    </div>
  );
};

export default QuizContest;

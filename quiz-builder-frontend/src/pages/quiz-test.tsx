import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import QuizContest from '../components/quiz/quiz-contest';
import Spinner from '../components/spinner/spinner';
import { Answer, PublicQuiz } from '../context/quiz-context';
import quizService from '../services/quiz.service';

function QuizTest() {
  const { permalink } = useParams();
  const [quizResult, setQuizResult] = useState<{ total: number; score: number } | null>(
    null,
  );
  const [quiz, setQuiz] = useState<PublicQuiz | null>(null);

  useEffect(() => {
    const getQuiz = async () => {
      const { data: quiz } = await quizService.getQuizByPermalink(permalink!);

      setQuiz(quiz);
    };

    getQuiz();
  }, [permalink]);

  const handleComplete = async (userInput: { answer: Answer[] }) => {
    const {
      data: { total, score },
    } = await quizService.checkAnswer(permalink!, userInput);

    setQuizResult({ total, score });
  };

  return (
    <>
      <Spinner visible={!quiz} />

      {!!quiz && (
        <QuizContest quiz={quiz} onComplete={handleComplete} result={quizResult} />
      )}
    </>
  );
}

export default QuizTest;

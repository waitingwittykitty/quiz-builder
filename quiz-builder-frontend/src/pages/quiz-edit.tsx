import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

import QuizForm, { QuizFormValues } from '../components/quiz-form/quiz-form';
import { Quiz } from '../context/quiz-context';
import quizService from '../services/quiz.service';

export type QuizEditErrorResponse = {
  message: string;
};

function QuizEdit() {
  const navigate = useNavigate();
  const { id: quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getQuizById = async () => {
      if (quizId) {
        const { data: quiz } = await quizService.getQuizById(quizId);

        setQuiz(quiz);
      }
    };

    getQuizById();
  }, [quizId]);

  const handleSubmit = async (formValues: QuizFormValues) => {
    if (!quiz) {
      return;
    }

    const { title, questions } = formValues;

    setSubmitting(true);

    try {
      const {
        data: { message },
      } = await quizService.updateQuiz(quiz, { title, questions });

      setSubmitting(false);
      toast.success(message);
      navigate('/quizzes');
    } catch (e) {
      let error = e as Error | AxiosError;
      let message = error.message;

      if (axios.isAxiosError(error)) {
        message =
          (error?.response?.data as QuizEditErrorResponse).message ||
          error.message ||
          error.toString();
      }

      setSubmitting(false);
      toast.error(message);
    }
  };

  const handleReturn = () => {
    navigate('/quizzes');
  };

  return (
    <div className="quiz-edit-page page-container">
      <QuizForm
        quiz={quiz}
        onSubmit={handleSubmit}
        submitting={submitting}
        onReturn={handleReturn}
      />
    </div>
  );
}

export default QuizEdit;

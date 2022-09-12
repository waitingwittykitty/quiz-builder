import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import QuizForm, { QuizFormValues } from '../components/quiz-form/quiz-form';
import quizService from '../services/quiz.service';

export type QuizAddErrorResponse = {
  message: string;
};

function QuizAdd() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formValues: QuizFormValues) => {
    const { title, questions } = formValues;

    setSubmitting(true);

    try {
      const {
        data: { message },
      } = await quizService.addQuiz({ title, questions });

      setSubmitting(false);
      toast.success(message);
      navigate('/quizzes');
    } catch (e) {
      let error = e as Error | AxiosError;
      let message = error.message;

      if (axios.isAxiosError(error)) {
        message =
          (error?.response?.data as QuizAddErrorResponse).message ||
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
    <div className="quiz-add-page page-container">
      <QuizForm onSubmit={handleSubmit} submitting={submitting} onReturn={handleReturn} />
    </div>
  );
}

export default QuizAdd;

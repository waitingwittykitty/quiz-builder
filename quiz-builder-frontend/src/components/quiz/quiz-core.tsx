import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import { Answer, PublicQuiz } from '../../context/quiz-context';
import Spinner from '../spinner/spinner';
import Select from '../form/select';
import QuizResult from './result';

export interface QuizCoreProps {
  quiz: PublicQuiz;
  result: {
    total: number;
    score: number;
  } | null;
  onSubmit: (formValues: { answer: Answer[] }) => void;
}

function QuizCore({ quiz, result, onSubmit }: QuizCoreProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const questionCount = quiz.questions.length;
  const question = quiz.questions[questionIndex];
  const [finished, setFinished] = useState(false);

  const handleSubmit = (formValues: { answer: Answer[] }) => {
    setFinished(true);
    onSubmit(formValues);
  };

  const handleNext = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (questionIndex + 1 < questionCount!) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  return (
    <section className="quiz">
      {!finished && (
        <>
          <Formik initialValues={{ answer: [] }} onSubmit={handleSubmit}>
            <Form>
              <h2>{quiz?.title}</h2>

              <article>
                <div>
                  <p>{question?.question}</p>
                </div>

                <div>
                  {question?.type === 'multiple' ? (
                    <p>You can choose multiple answers</p>
                  ) : (
                    <p>You can choose a single answer</p>
                  )}
                </div>

                <ul>
                  {question?.answers?.map((answer, index) => (
                    <li key={index}>
                      <h3 className="answer-header">Answer {index + 1}: </h3>
                      <p className="answer-content">{answer}</p>
                    </li>
                  ))}
                </ul>

                <span>
                  {questionIndex} / {questionCount}
                </span>
              </article>

              <div className="form-group">
                <label htmlFor={`answer.${questionIndex}`}> Correct Answer </label>
                <Field
                  name={`answer.${questionIndex}`}
                  component={Select}
                  isMulti={question?.type === 'multiple'}
                  options={question?.answers?.map((answer, index) => ({
                    label: `Answer ${index + 1}`,
                    value: index + 1,
                  }))}
                />
                <ErrorMessage
                  name={`answer.${questionIndex}`}
                  component="div"
                  className="alert alert-danger mt-2"
                />
              </div>

              {questionIndex + 1 < questionCount! ? (
                <button type="button" className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              )}
            </Form>
          </Formik>
        </>
      )}

      <Spinner visible={finished && !result} />

      {finished && !!result && <QuizResult result={result} />}
    </section>
  );
}

export default QuizCore;

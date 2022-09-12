import { Field, FieldArray, Form, ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';

import { Question, Quiz } from '../../context/quiz-context';
import InputQuestions from './input-questions';

import './styles.scss';

export interface QuizFormValues {
  title: string;
  questions: Question[];
}

export interface QuizFormProps {
  quiz?: Quiz;
  onSubmit: (formValues: QuizFormValues) => void;
  submitting: boolean;
  onReturn: () => void;
}

function QuizForm({ quiz, onSubmit, onReturn, submitting }: QuizFormProps) {
  const initialValues: QuizFormValues = quiz
    ? { title: quiz.title, questions: quiz.questions }
    : {
        title: '',
        questions: [],
      };

  const formTitle = quiz ? 'Edit Quiz' : 'Add Quiz';

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    questions: Yup.array()
      .min(1, 'Must add a question')
      .of(
        Yup.object().shape({
          question: Yup.string().required('Required!'),
          answers: Yup.array()
            .min(2, 'Must add more than two answers')
            .of(Yup.string().required('Required!')),
          type: Yup.string().required('Required!').nullable(),
          correctAnswer: Yup.mixed()
            .test('is-correct-answer', 'Invalid value', function (value, ctx) {
              const { path, createError } = this;

              if (!value) return createError({ path, message: 'Required!' });

              if (ctx.parent.type === 'single' && typeof value !== 'number') {
                return createError({ path, message: 'Choose only one correct answer' });
              }

              if (
                ctx.parent.type === 'multiple' &&
                (!(value instanceof Array) || value.length < 2)
              ) {
                return createError({
                  path,
                  message: 'Choose more than 2 correct answers',
                });
              }

              return true;
            })
            .required('Required!'),
        }),
      ),
  });

  const handleSubmit = (formValues: QuizFormValues) => {
    onSubmit(formValues);
  };

  const handleReturn = (event: React.SyntheticEvent) => {
    event.preventDefault();

    onReturn();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      <Form className="quiz-form">
        <h3>{formTitle}</h3>

        <div className="form-group">
          <label htmlFor="title"> Title </label>
          <Field name="title" type="text" className="form-control" />
          <ErrorMessage
            name="title"
            component="div"
            className="alert alert-danger mt-2"
          />
        </div>

        <div className="form-group">
          <FieldArray name="questions" render={InputQuestions} />
          <ErrorMessage
            name="questions"
            render={error => {
              if (typeof error === 'string') {
                return <div className="alert alert-danger mt-2">{error.toString()}</div>;
              }

              return null;
            }}
          />
        </div>

        <div className="form-group button-group">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            Submit
          </button>

          <button className="btn" type="button" onClick={handleReturn}>
            Return
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default QuizForm;

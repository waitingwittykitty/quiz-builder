import {
  ArrayHelpers,
  ErrorMessage,
  Field,
  FieldArray,
  FieldArrayRenderProps,
} from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { Question } from '../../context/quiz-context';
import Select from '../form/select';
import InputAnswers from './input-answers';

export interface InputQuestionsProps {
  arrayHelpers: ArrayHelpers;
}

function InputQuestions({ name, push, remove, form }: FieldArrayRenderProps) {
  const { values } = form;

  const handleAdd = () => {
    push({ question: '', type: null, answer: [], correctAnswer: null });
  };

  return (
    <ul>
      <li>
        <button className="btn btn-primary" type="button" onClick={handleAdd}>
          <FontAwesomeIcon icon={faPlusSquare} className="preicon" /> Add Question
        </button>
      </li>

      {values.questions.map((value: Question, index: number) => (
        <li key={index} className="relative">
          <div className="sub-header">
            <h4>Question {index + 1}</h4>

            <button
              className="btn btn-danger"
              type="button"
              title="Remove Question"
              onClick={() => remove(index)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>

          <div className="form-group">
            <Field
              className="form-control"
              name={`${name}.${index}.question`}
              type="text"
            />

            <ErrorMessage
              name={`${name}.${index}.question`}
              component="div"
              className="alert alert-danger mt-2"
            />
          </div>

          <div className="form-group">
            <Field
              name={`${name}.${index}.type`}
              component={Select}
              options={[
                { value: 'single', label: 'Single' },
                { value: 'multiple', label: 'Multiple' },
              ]}
              label="Question Type"
            />

            <ErrorMessage
              name={`${name}.${index}.type`}
              component="div"
              className="alert alert-danger mt-2"
            />
          </div>

          <div className="form-group">
            <FieldArray name={`${name}.${index}.answers`} render={InputAnswers(value)} />

            <ErrorMessage
              name={`${name}.${index}.answers`}
              component="div"
              className="alert alert-danger mt-2"
              render={errorMessage => {
                if (typeof errorMessage === 'object') {
                  return null;
                }

                return <div className="alert alert-danger mt-2">{errorMessage}</div>;
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${name}.${index}.correctAnswer`}> Correct Answer </label>

            <Field
              name={`${name}.${index}.correctAnswer`}
              label="Correct Answer"
              component={Select}
              options={value?.answers?.map((answer, index) => ({
                label: `Answer ${index + 1}`,
                value: index + 1,
              }))}
              disabled={!value.type}
              isMulti={value?.type === 'multiple'}
            />

            <ErrorMessage
              name={`${name}.${index}.correctAnswer`}
              component="div"
              className="alert alert-danger mt-2"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default InputQuestions;

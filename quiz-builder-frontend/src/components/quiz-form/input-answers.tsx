import { ErrorMessage, Field, FieldArrayRenderProps } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Question } from '../../context/quiz-context';

function InputAnswers(question: Question) {
  return function ({ name, push, remove }: FieldArrayRenderProps) {
    return (
      <ul>
        <li>
          <button className="btn btn-primary" type="button" onClick={() => push('')}>
            <FontAwesomeIcon icon={faPlus} className="preicon" /> Add Answer
          </button>
        </li>

        {question?.answers?.map((value: string, index: number) => (
          <li key={index} className="relative">
            <div className="sub-header">
              <h5>Answer {index + 1}</h5>

              <button
                className="btn btn-danger"
                type="button"
                title="Remove Answer"
                onClick={() => remove(index)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>

            <Field
              className="form-control"
              name={`${name}.${index}`}
              type="text"
              label={`Answer ${index + 1}`}
              placeholder="Answer"
            />

            <ErrorMessage
              name={`${name}.${index}`}
              render={errorMessage =>
                errorMessage.length > 1 && (
                  <div className="alert alert-danger mt-2">{errorMessage}</div>
                )
              }
            />
          </li>
        ))}
      </ul>
    );
  };
}

export default InputAnswers;

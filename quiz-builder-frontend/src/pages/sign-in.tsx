import axios from 'axios';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useAuthContext } from '../context/auth-context';
import AuthService from '../services/auth.service';
import { emailValidation } from '../utils/validation';

export type SignInFormValues = {
  email: string;
  password: string;
};

export type SignInErrorResponse = {
  message: string;
};

function SignIn() {
  const initialValues: SignInFormValues = {
    email: '',
    password: '',
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuthContext();

  const validationSchema = () => {
    return Yup.object().shape({
      email: emailValidation,
      password: Yup.string().required('Wrong password'),
    });
  };

  const handleSignIn = async (
    formValues: SignInFormValues,
    { setFieldError }: FormikHelpers<SignInFormValues>,
  ) => {
    const { email, password } = formValues;

    setFieldError('password', '');
    setLoading(true);

    try {
      const currentUser = await AuthService.signIn(email, password);

      toast.success('Successfully Logged in');
      setCurrentUser(currentUser);
      setLoading(false);
      navigate('/quizzes');
    } catch (error) {
      let message = '';

      if (error instanceof Error) {
        message = error.message;
      }

      if (axios.isAxiosError(error)) {
        message =
          (error?.response?.data as SignInErrorResponse).message ||
          error.message ||
          error.toString();
      }

      setLoading(false);
      setFieldError('password', message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div className="profile-img-card">
          <img
            src="https://www.tutorialrepublic.com/examples/images/avatar.png"
            alt="profile-img"
          />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSignIn}
          validateOnBlur={false}
          validateOnChange={false}
        >
          <Form className="auth-form">
            <div className="w-full">
              <h3>Sign In</h3>

              <div className="form-group">
                <label htmlFor="email"> Email </label>
                <Field name="email" type="email" className="form-control" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="alert alert-danger mt-2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password"> Password </label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger mt-2"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  {loading && <span className="spinner-border spinner-border-sm"></span>}
                  <span>Sign In</span>
                </button>
              </div>
              <p className="forgot-password text-right">
                Don't have an account? <a href="/sign-up">sign up</a>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default SignIn;

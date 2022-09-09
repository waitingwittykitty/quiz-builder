import axios, { AxiosError, AxiosResponse } from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import AuthService from '../services/auth.service';
import {
  confirmPasswordValidation,
  emailValidation,
  passwordValidation,
} from '../utils/validation';

export type SignUpFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpErrorResponse = {
  message: string;
};

function SignUp() {
  const navigate = useNavigate();

  const initialValues: SignUpFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');

  const validationSchema = () => {
    return Yup.object().shape({
      email: emailValidation,
      password: passwordValidation,
      confirmPassword: confirmPasswordValidation,
    });
  };

  const handleSignUp = async (formValues: SignUpFormValues) => {
    const { email, password } = formValues;

    setMessage('');
    setSuccessful(false);

    try {
      const response: AxiosResponse = await AuthService.signUp(email, password);

      toast.success('Successfully Registered');
      setMessage(response.data.message);
      setSuccessful(true);
      navigate('/sign-in');
    } catch (e) {
      let error = e as Error | AxiosError;
      let message = error.message;

      if (axios.isAxiosError(error)) {
        message =
          (error?.response?.data as SignUpErrorResponse).message ||
          error.message ||
          error.toString();
      }

      setSuccessful(false);
      setMessage(message);
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
          onSubmit={handleSignUp}
          validateOnBlur={false}
          validateOnChange={false}
        >
          <Form className="auth-form">
            {!successful && (
              <div className="w-full">
                <h3>Sign Up</h3>

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
                  <label htmlFor="confirmPassword"> Confirm Password </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="alert alert-danger mt-2"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary w-full">
                    Sign Up
                  </button>
                </div>
                <p className="forgot-password text-right">
                  Already registered? <a href="/sign-in">sign in</a>
                </p>
              </div>
            )}
            {message && (
              <div className="form-group">
                <div
                  className={successful ? 'alert alert-success' : 'alert alert-danger'}
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default SignUp;

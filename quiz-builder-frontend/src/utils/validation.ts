import * as Yup from 'yup';

export const emailValidation = Yup.string()
  .email('This is not a valid email.')
  .required('This field is required!');

export const passwordValidation = Yup.string()
  .test(
    'len',
    'The password must be between 6 and 40 characters.',
    (val: any) => val && val.toString().length >= 6 && val.toString().length <= 40,
  )
  .required('This field is required!');

export const confirmPasswordValidation = Yup.string()
  .oneOf([Yup.ref('password')], 'Passwords must match')
  .required('This field is required!');

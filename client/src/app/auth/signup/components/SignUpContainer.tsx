'use client';

import React from 'react';
import Link from 'next/link';
import { useSignUpUser } from '../hooks';
import { SignUpForm } from './SignUpForm';
import { UserSignUpModel } from '../types';
import FormLayout from '../../../../layout/FormLayout';

export const SignUpContainer: React.FC = () => {
  const { signUpUser } = useSignUpUser();


  const signUpUserHandler = (data: UserSignUpModel) => {
    signUpUser(data);
  }

  return (
    <React.Fragment>
      <FormLayout>
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
          <span className="text-600 font-medium">Sign up to continue</span>
        </div>
        <SignUpForm signUpUser={signUpUserHandler} />
        <div className='mt-6 flex align-items-center justify-content-center font-medium mb-3'>
          Have an account?
          <Link target="_self" href={`/auth/login`} className='ml-3' > Log in </Link>
        </div>
      </FormLayout>
    </React.Fragment>
  );
};
'use client';

import React from 'react';
import Link from 'next/link';
import { useLoginUser } from '../hooks';
import { LoginForm } from './LoginForm';
import { UserLoginModel } from '../types/UserLoginModel';
import FormLayout from '../../../../layout/FormLayout';

export const LoginContainer: React.FC = () => {
  const { loginUser } = useLoginUser();

  const loginUserHandler = (data: UserLoginModel) => {
    loginUser(data);
  }

  return (
    <React.Fragment>
      <FormLayout>
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
          <span className="text-600 font-medium">Sign in to continue</span>
        </div>
        <LoginForm loginUser={loginUserHandler} />
        <div className='mt-6 flex align-items-center justify-content-center font-medium mb-3'>
          Don't have an account?
          <Link target="_self" href={`/auth/signup`} className='ml-3' > Sign up </Link>
        </div>
      </FormLayout>
    </React.Fragment>
  );
};
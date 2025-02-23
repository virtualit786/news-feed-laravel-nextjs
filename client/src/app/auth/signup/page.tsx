import React from 'react';
import { SignUpContainer } from './components/SignUpContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up'
};

const SignUpPage = () => {

  return (
    <SignUpContainer />
  );
};

export default SignUpPage;
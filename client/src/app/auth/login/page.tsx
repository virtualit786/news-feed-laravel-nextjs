import React from 'react';
import { Metadata } from 'next';
import { LoginContainer } from './components/LoginContainer';

export const metadata: Metadata = {
  title: 'Login '
};

const LoginPage = () => {

  return (
    <LoginContainer />
  );
};

export default LoginPage;

import React from 'react';
import { Metadata } from 'next';
import { ArticlesContainer } from './components/ArticlesContainer';
import AppLayout from '../../layout/AppLayout';

export const metadata: Metadata = {
  title: 'Articles'
};

const ArticlesPage = () => {

  return (
    <AppLayout>
      <ArticlesContainer />
    </AppLayout>
  );
};

export default ArticlesPage;

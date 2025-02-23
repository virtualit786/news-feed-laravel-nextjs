import React from 'react';
import { Metadata } from 'next';
import { PreferencesContainer } from './components/PreferencesContainer';
import AppLayout from '../../layout/AppLayout';

export const metadata: Metadata = {
  title: 'Preferences',
};

const PreferencesPage = () => {

  return (
    <AppLayout>
      <PreferencesContainer />
    </AppLayout>
  );
};

export default PreferencesPage;

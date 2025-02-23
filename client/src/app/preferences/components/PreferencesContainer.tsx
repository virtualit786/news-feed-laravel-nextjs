'use client';
import React from 'react';
import { PreferencesUserModel } from '../types/PreferencesUserModel';
import { PreferencesForm } from './PreferencesForm';
import { useToUpdatePreferences } from '../hooks';
import FormLayout from '../../../layout/FormLayout';
import { useFetchFiltersOptions } from '@components/articles/hooks/useFetchFiltersOptions';
import { useFetchPreferences } from '@components/articles/hooks';

export const PreferencesContainer: React.FC = () => {
  const { updatePreferences } = useToUpdatePreferences();
  const { authors, categories, sources } = useFetchFiltersOptions();
  const { userPreferences } = useFetchPreferences();

  const preferencesHandler = (data: PreferencesUserModel) => {
    updatePreferences(data);
  }

  return (
    <React.Fragment>
      <FormLayout>
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">Preferences</div>
        </div>
        <PreferencesForm preferences={preferencesHandler} authors={authors} categories={categories} sources={sources} userPreferences={userPreferences} />
      </FormLayout>
    </React.Fragment>
  );
};
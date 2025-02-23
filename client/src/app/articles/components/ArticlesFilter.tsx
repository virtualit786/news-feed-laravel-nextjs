'use client';

import React, { FC, useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, FormFieldWithLabel, MultiSelectDropdown, TextField } from '../../../components/forms';
import { ArticlesFilterModel } from '../types';
import { ValueLabelModel } from '../../../shared/types';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface ArticlesFilterProps {
  filter: ArticlesFilterModel;
  onChangeFilter: (filter: ArticlesFilterModel) => void;
  fetchArticles: (filter: ArticlesFilterModel) => Promise<void>
  categories: ValueLabelModel[];
  authors: ValueLabelModel[];
  sources: ValueLabelModel[];
}

export const ArticlesFilter: FC<ArticlesFilterProps> = ({ filter, authors, categories, sources, onChangeFilter, fetchArticles }) => {
  const [isFilterApply, setIsFilterApply] = useState<boolean>(false);

  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm<ArticlesFilterModel>({});

  const handleApplyFilter: SubmitHandler<ArticlesFilterModel> = (data: ArticlesFilterModel) => {
    if (!_.isEmpty(data?.q)) {
      onChangeFilter(data);
    } else {
      fetchArticles(data);
    }
    setIsFilterApply(true);
  }

  const handleClearFilter = () => {
    fetchArticles(filter);
    reset(filter);
    setIsFilterApply(false);
  }

  useEffect(() => {
    reset(filter)
  }, [filter])


  return (
    <div className='mb-3 w-full'>
      <div className='grid'>
        <div className='col-6 md:col-6 lg:col-2'>
          <Controller name="author" control={control} defaultValue={filter?.author ?? []}
            render={({ field }) => (
              <FormFieldWithLabel
                label="Author"
                labelClassName="block text-600 text-xl font-medium"
                labelContainerClassName='center'
                formField={
                  <MultiSelectDropdown value={field?.value} options={authors ?? []} onChange={field.onChange} placeholder={'Select Author'} scrollHeight={'200px'} maxSelectedLabels={1} enableFilter selectionLimit={1} className="w-full p-1" panelClassName='p-2' />
                } />
            )}
          />
        </div>
        <div className='col-6 md:col-6 lg:col-2'>
          <Controller name="category" control={control} defaultValue={filter?.category ?? []}
            render={({ field }) => (
              <FormFieldWithLabel
                label="Category"
                labelClassName="block text-600 text-xl font-medium"
                labelContainerClassName='center'
                formField={
                  <MultiSelectDropdown value={field?.value} options={categories ?? []} onChange={field.onChange} placeholder={'Select Category'} scrollHeight={'200px'} maxSelectedLabels={1} enableFilter selectionLimit={1} className="w-full p-1" panelClassName='p-2' />
                } />
            )}
          />
        </div>
        <div className='col-6 md:col-6 lg:col-2'>
          <Controller name="source" control={control} defaultValue={filter?.source ?? []}
            render={({ field }) => (
              <FormFieldWithLabel
                label="Source"
                labelClassName="block text-600 text-xl font-medium"
                labelContainerClassName='center'
                formField={
                  <MultiSelectDropdown value={field?.value} options={sources ?? []} onChange={field.onChange} placeholder={'Select Source'} scrollHeight={'200px'} maxSelectedLabels={1} enableFilter selectionLimit={1} className="w-full p-1" panelClassName='p-2' />
                } />
            )}
          />
        </div>
        <div className='col-6 md:col-6 lg:col-4'>
          <Controller name="q" control={control} defaultValue={''}
            render={({ field }) => (
              <FormFieldWithLabel
                label="Term"
                labelClassName="block text-600 text-xl font-medium"
                labelContainerClassName='center'
                formField={
                  <TextField className="w-full" value={field?.value ?? ''} placeholder='Enter Term' onChange={field?.onChange} errorMessage={errors?.q?.message} />
                } />
            )}
          />
        </div>
        <div className='col-6 md:col-6 lg:col-2 flex justify-content-end align-items-end gap-2'>
          <div className='mb-2'><Button icon='pi pi-filter' severity="info" onClick={handleSubmit(handleApplyFilter)} /></div>
          <div className='mb-2'><Button icon='pi pi-filter-slash' severity="secondary" onClick={handleClearFilter} disable={!isFilterApply} /></div>
        </div>
      </div>
    </div>
  )
}
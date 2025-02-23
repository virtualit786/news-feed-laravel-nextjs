import _ from "lodash";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PreferencesUserModel } from "../types";
import { Button, FormFieldWithLabel, MultiSelectDropdown } from "../../../components/forms";
import { ValueLabelModel } from "../../../shared/types";
import { ArticlesFilterModel } from "@components/articles/types";

interface PreferencesFormProps {
  preferences: (user: PreferencesUserModel) => void;
  categories: ValueLabelModel[];
  authors: ValueLabelModel[];
  sources: ValueLabelModel[];
  userPreferences: ArticlesFilterModel
}

export const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, authors, categories, userPreferences, sources }) => {
  const { control, handleSubmit, getValues, reset, formState: { errors } } = useForm<PreferencesUserModel>({});

  const submitForm: SubmitHandler<PreferencesUserModel> = (data: PreferencesUserModel) => {
    preferences(data);
  }

  useEffect(() => {
    reset({ author_ids: userPreferences?.author, category_ids: userPreferences?.category, source_ids: userPreferences?.source })
  }, [userPreferences])

  return (
    <div>
      <div className="md:w-30rem  field">
        <Controller name="author_ids" control={control} defaultValue={[]}
          render={({ field }) => (
            <FormFieldWithLabel
              label="Author"
              labelClassName="block text-900 text-xl font-medium"
              formField={
                <MultiSelectDropdown value={field?.value} options={authors ?? []} onChange={field.onChange} placeholder={'Select Author'} scrollHeight={'200px'} maxSelectedLabels={1} selectionLimit={1} enableFilter className="w-full md:w-30rem  p-1" />
              } />
          )}
        />
      </div>
      <div className="md:w-30rem  field">
        <Controller name="category_ids" control={control} defaultValue={[]}
          render={({ field }) => (
            <FormFieldWithLabel
              label="Category"
              labelClassName="block text-900 text-xl font-medium"
              formField={
                <MultiSelectDropdown value={field?.value} options={categories ?? []} onChange={field.onChange} placeholder={'Select Category'} scrollHeight={'200px'} maxSelectedLabels={1} selectionLimit={1} enableFilter className="w-full md:w-30rem  p-1" />
              } />
          )}
        />
      </div>
      <div className="md:w-30rem  field">
        <Controller name="source_ids" control={control} defaultValue={[]}
          render={({ field }) => (
            <FormFieldWithLabel
              label="Source"
              labelClassName="block text-900 text-xl font-medium"
              formField={
                <MultiSelectDropdown value={field?.value} options={sources ?? []} onChange={field.onChange} placeholder={'Select Source'} scrollHeight={'200px'} maxSelectedLabels={1} selectionLimit={1} enableFilter className="w-full md:w-30rem  p-1" />
              } />
          )}
        />
      </div>
      <Button className="p-button-lg w-full mt-6" label='Save' onClick={handleSubmit(submitForm)} />
    </div>
  )
}
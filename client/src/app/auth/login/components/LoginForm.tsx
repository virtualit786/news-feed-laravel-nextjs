'use client';
import _ from "lodash";
import React from 'react';
import { UserLoginModel } from '../types/UserLoginModel';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, FormFieldWithLabel, Password, TextField } from "../../../../components/forms";
import Link from "next/link";

interface LoginFormProps {
  loginUser: (user: UserLoginModel) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loginUser }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<UserLoginModel>({});

  const submitForm: SubmitHandler<UserLoginModel> = (data: UserLoginModel) => {
    loginUser(data);
  }

  return (
    <div className="w-full">
      <div className="md:w-30rem  field">
        <Controller name="email" control={control} defaultValue={""}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <FormFieldWithLabel
              label="Email" labelClassName="block text-900 text-xl font-medium"
              formField={
                <TextField value={field?.value} onChange={(value) => field.onChange(value?.trim())} placeholder={'Enter your email address'} errorMessage={errors?.email?.message} className="w-full md:w-30rem  p-3" />
              } />
          )}
        />
      </div>

      <div className="md:w-30rem  field">
        <Controller name="password" control={control} defaultValue={""}
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <FormFieldWithLabel
              label="Password"
              labelClassName="block text-900 text-xl font-medium"
              formField={
                <Password feedback={false} value={field?.value} onChange={field?.onChange} placeholder={'Enter your password'} errorMessage={errors?.password?.message} className={" w-full"} inputClassName={"w-full md:w-30rem p-3"} />
              }
            />)} />
      </div>
      <Button className="p-button-lg w-full mt-5" label='Sign In' onClick={handleSubmit(submitForm)} />
    </div>
  );
};
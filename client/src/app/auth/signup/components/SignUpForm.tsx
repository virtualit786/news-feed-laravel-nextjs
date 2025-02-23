import _ from "lodash";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, FormFieldWithLabel, Password, TextField } from "../../../../components/forms";
import { UserSignUpModel } from "../types";
import { EMAIL_VALIDATION_REGEX } from "../../../../shared/variables";

interface SignUpFormProps {
  signUpUser: (user: UserSignUpModel) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ signUpUser }) => {
  const { control, handleSubmit, getValues, formState: { errors } } = useForm<UserSignUpModel>({});

  const submitForm: SubmitHandler<UserSignUpModel> = (data: UserSignUpModel) => {
    signUpUser(data);
  }

  return (
    <div className="w-full">
      <div className="w-full md:w-30rem  field">
        <Controller name="name" control={control} defaultValue={""}
          rules={{
            required: "This field is required",
          }}
          render={({ field }) => (
            <FormFieldWithLabel
              label="Name"
              labelClassName="block text-900 text-xl font-medium"
              formField={
                <TextField value={field?.value} onChange={(value) => field.onChange(value?.trim())} placeholder={'Enter your name'} errorMessage={errors?.name?.message} className="w-full md:w-30rem  p-3" />
              } />
          )}
        />
      </div>
      <div className="w-full md:w-30rem  field">
        <Controller name="email" control={control} defaultValue={""}
          rules={{
            required: "This field is required",
            pattern: { value: EMAIL_VALIDATION_REGEX, message: "Invalid email address" }
          }}
          render={({ field }) => (
            <FormFieldWithLabel
              label="Email"
              labelClassName="block text-900 text-xl font-medium"
              formField={
                <TextField value={field?.value} onChange={(value) => field.onChange(value?.trim())} placeholder={'Enter your email address'} errorMessage={errors?.email?.message} className="w-full md:w-30rem  p-3" />
              } />
          )}
        />
      </div>

      <div className="w-full md:w-30rem  field">
        <Controller name="password" control={control} defaultValue={""}
          rules={{
            required: "Password is required",
            minLength: { value: 8, message: "Password length should be at least 8 characters" },
            pattern: { value: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, message: "Password must be at least 8 characters, and include at least one number" }
          }}
          render={({ field }) => (
            <FormFieldWithLabel label="Password" labelClassName="block text-900 text-xl font-medium"
              formField={
                <Password feedback={true} value={field?.value} onChange={field?.onChange} placeholder={'Enter your password'} errorMessage={errors?.password?.message} className={" w-full"} inputClassName={"w-full p-3 md:w-30rem"} />
              } />)} />
      </div>

      <div className="w-full mt-3 md:w-30rem field">
        <Controller name='password_confirmation' control={control} defaultValue={""}
          rules={{
            required: "Confirm password is required",
            validate: (confirmPassword) => confirmPassword === getValues("password"),
            minLength: { value: 8, message: "Password length should be at least 8 characters" },
            pattern: { value: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, message: "Password must be at least 8 characters, and include at least one number" }
          }}
          render={({ field }) => (
            <FormFieldWithLabel label="Confirm Password" labelClassName="block text-900 text-xl font-medium"
              formField={
                <Password feedback={true} value={field?.value} onChange={field?.onChange} className={"w-full"} inputClassName={"w-full p-3 md:w-30rem"} placeholder={"Re-enter your password"}
                  errorMessage={errors?.password_confirmation?.type == "validate" ? "Passwords do not match" : errors?.password_confirmation?.message}
                />
              } />)} />
      </div>
      <Button className="p-button-lg w-full mt-5" label='Sign up' onClick={handleSubmit(submitForm)} />
    </div>
  )
}
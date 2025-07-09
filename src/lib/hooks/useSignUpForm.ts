"use client";

import React, { useState } from "react";
import { signUpSchema } from "@/lib/validations";

interface FormState {
  nickname: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

interface ErrorsState {
  [key: string]: string;
}

export default function useSignUpForm() {
  const [form, setForm] = useState<FormState>({
    nickname: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState<ErrorsState>({});

  const validateField = (name: string, value: string) => {
    const inputField = { ...form, [name]: value };
    const result = signUpSchema.safeParse(inputField);

    if (!result.success) {
      const error = result.error.flatten().fieldErrors[name as keyof FormState];
      setErrors((prev) => ({ ...prev, [name]: error?.[0] || "" }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    validateField(name, value);
  };

  return { form, errors, setErrors, handleChange };
}

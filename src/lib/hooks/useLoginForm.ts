"use client";

import { loginSchema } from "@/lib/validations";
import { useState } from "react";

interface FormState {
  email: string;
  password: string;
}

interface ErrorsState {
  [key: string]: string;
}

export default function useLoginForm() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ErrorsState>({});

  const validateField = (name: string, value: string) => {
    const inputField = { ...form, [name]: value };
    const result = loginSchema.safeParse(inputField);

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

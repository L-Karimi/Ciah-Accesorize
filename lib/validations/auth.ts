import {
  email,
  minLength,
  nonEmpty,
  object,
  pipe,
  string,
} from "valibot";

const emailField = pipe(
  string("Email is required."),
  nonEmpty("Email is required."),
  email("Enter a valid email address."),
);

const passwordField = pipe(
  string("Password is required."),
  minLength(8, "Password must be at least 8 characters."),
);

export const loginSchema = object({
  email: emailField,
  password: pipe(
    string("Password is required."),
    nonEmpty("Password is required."),
  ),
});

export const registerSchema = object({
  name: pipe(string("Name is required."), nonEmpty("Name is required.")),
  email: emailField,
  password: passwordField,
  confirmPassword: pipe(
    string("Please confirm your password."),
    minLength(8, "Password must be at least 8 characters."),
  ),
});

export const forgotPasswordSchema = object({
  email: emailField,
});

export const resetPasswordSchema = object({
  password: passwordField,
  confirmPassword: pipe(
    string("Please confirm your password."),
    minLength(8, "Password must be at least 8 characters."),
  ),
});

export const profileSchema = object({
  name: pipe(string("Name is required."), nonEmpty("Name is required.")),
  phone: pipe(string("Phone is required."), nonEmpty("Phone is required.")),
});

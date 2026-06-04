import { email, minLength, nonEmpty, object, pipe, string } from "valibot";

export const inquirySchema = object({
  name: pipe(string("Name is required."), nonEmpty("Name is required.")),
  email: pipe(
    string("Email is required."),
    nonEmpty("Email is required."),
    email("Enter a valid email address."),
  ),
  message: pipe(
    string("Message is required."),
    minLength(12, "Tell us a little more so we can help."),
  ),
});

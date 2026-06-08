import {
  email,
  maxLength,
  minLength,
  nonEmpty,
  object,
  pipe,
  string,
} from "valibot";

const requiredText = (fieldName: string) =>
  pipe(string(`${fieldName} is required.`), nonEmpty(`${fieldName} is required.`));

export const checkoutSchema = object({
  name: requiredText("Name"),
  email: pipe(
    string("Email is required."),
    nonEmpty("Email is required."),
    email("Enter a valid email address."),
  ),
  phone: pipe(
    string("Phone is required."),
    nonEmpty("Phone is required."),
    minLength(10, "Enter a valid phone number."),
    maxLength(20, "Phone number is too long."),
  ),
  county: requiredText("County"),
  deliveryAddress: pipe(
    string("Delivery address is required."),
    nonEmpty("Delivery address is required."),
    minLength(10, "Add a full delivery address so we know where to send your order."),
  ),
  notes: pipe(
    string(),
    maxLength(300, "Notes should be 300 characters or fewer."),
  ),
});

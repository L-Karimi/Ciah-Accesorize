export const kenyaCountyOptions = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
] as const;

export interface CheckoutFormDefaults {
  name: string;
  email: string;
  phone: string;
  county: string;
  deliveryAddress: string;
  notes: string;
}

export function splitCustomerName(name: string) {
  const normalizedName = name.trim().replace(/\s+/g, " ");
  const [firstName, ...rest] = normalizedName.split(" ");

  return {
    firstName: firstName || "Customer",
    lastName: rest.join(" ") || "Ciah",
  };
}

export function buildShippingAddressSnapshot(input: CheckoutFormDefaults) {
  const lines = [
    `Name: ${input.name.trim()}`,
    `Email: ${input.email.trim().toLowerCase()}`,
    `Phone: ${input.phone.trim()}`,
    `County: ${input.county.trim()}`,
    `Delivery Address: ${input.deliveryAddress.trim()}`,
  ];

  if (input.notes.trim()) {
    lines.push(`Notes: ${input.notes.trim()}`);
  }

  return lines.join("\n");
}

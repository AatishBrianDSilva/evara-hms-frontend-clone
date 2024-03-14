import { differenceInYears } from "date-fns";

export function calculateAge(dob: Date): number {
  const today = new Date();
  return differenceInYears(today, dob);
}

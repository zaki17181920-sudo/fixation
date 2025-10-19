import { z } from 'zod';

const requiredString = z.string().min(1, 'यह फ़ील्ड आवश्यक है');
const requiredDate = z.date({
  required_error: 'कृपया एक तारीख चुनें।',
  invalid_type_error: "यह एक मान्य तारीख नहीं है।",
});

export const formSchema = z.object({
  pran: requiredString,
  competencyApplicationNumber: requiredString,

  // Teacher Information
  teacherName: requiredString,
  schoolName: requiredString,
  udiseCode: requiredString,
  className: requiredString,
  subject: requiredString,
  appointmentCategory: requiredString,
  dateOfBirth: requiredDate,
  block: requiredString, // New field for 'प्रखंड'

  // Salary Details
  dateOfJoiningAsSpecificTeacher: requiredDate,
  dateOfTraining: requiredDate,
  efficiencyType: requiredString,
  bankDetails: requiredString.optional(),
  ifscCode: requiredString,
  bankAccountNumber: requiredString,

  // Other Details
  dateOfFirstJoiningAsLocalBodyTeacher: requiredDate,
  dateOfReceivingTrainedPayScale: requiredDate,
  serviceBreak: z.string().optional(),
  levelForDecember2024Salary: requiredString,
  indexForDecember2024Salary: requiredString,
  december2024Salary: requiredString, // Corresponds to item 20
  dateOfJoiningForNewSalary: requiredDate, // New field for item 21
  levelForNewSalary: requiredString,
  indexForNewSalary: requiredString,
  newSalaryWithIncrement: requiredString, // Corresponds to item 21
  payMatrixSalary: requiredString.optional(), // Also part of item 21
  nextIncrementDate: requiredDate,
});

export type FormValues = z.infer<typeof formSchema>;

// This is the type that will be stored in Firestore.
// It's derived from the form values but with dates as strings.
export type PaySlip = Omit<FormValues, 'dateOfBirth' | 'dateOfJoiningAsSpecificTeacher' | 'dateOfTraining' | 'dateOfFirstJoiningAsLocalBodyTeacher' | 'dateOfReceivingTrainedPayScale' | 'nextIncrementDate' | 'dateOfJoiningForNewSalary'> & {
    dateOfBirth: string;
    dateOfJoiningAsSpecificTeacher: string;
    dateOfTraining: string;
    dateOfFirstJoiningAsLocalBodyTeacher: string;
    dateOfReceivingTrainedPayScale: string;
    nextIncrementDate: string;
    dateOfJoiningForNewSalary: string;
    createdAt: string;
};

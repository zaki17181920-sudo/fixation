import { z } from 'zod';

const requiredString = z.string().min(1, 'यह फ़ील्ड आवश्यक है');
const requiredDate = z.date({
  required_error: 'कृपया एक तारीख चुनें।',
  invalid_type_error: "यह एक मान्य तारीख नहीं है।",
});

export const formSchema = z.object({
  // Office Details
  office: requiredString,
  districtEducationOfficer: requiredString,
  district: requiredString,

  // Teacher Information
  teacherName: requiredString,
  schoolName: requiredString,
  udiseCode: requiredString,
  className: requiredString,
  subject: requiredString,
  appointmentCategory: requiredString,
  dateOfBirth: requiredDate,

  // Salary Details
  dateOfJoiningAsSpecificTeacher: requiredDate,
  dateOfTraining: requiredDate,
  efficiencyType: requiredString,
  bankDetails: requiredString,

  // Other Details
  dateOfFirstJoiningAsLocalBodyTeacher: requiredDate,
  dateOfReceivingTrainedPayScale: requiredDate,
});

export type FormValues = z.infer<typeof formSchema>;

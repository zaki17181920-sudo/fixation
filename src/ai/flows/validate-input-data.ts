'use server';

/**
 * @fileOverview This file defines a Genkit flow for validating user input data.
 *
 * It includes:
 * - `validateInputData`: A function to validate input data using AI.
 * - `ValidateInputDataInput`: The input type for the validateInputData function.
 * - `ValidateInputDataOutput`: The output type for the validateInputData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateInputDataInputSchema = z.object({
  officeDetails: z.object({
    office: z.string().describe('Office name'),
    districtEducationOfficer: z.string().describe('District Education Officer'),
    district: z.string().describe('District name'),
  }).describe('Office Details'),
  teacherInfo: z.object({
    teacherName: z.string().describe('Teacher name'),
    schoolName: z.string().describe('School name'),
    udiseCode: z.string().describe('U-DISE code'),
    className: z.string().describe('Class'),
    subject: z.string().describe('Subject'),
    appointmentCategory: z.string().describe('Appointment category'),
    dateOfBirth: z.string().describe('Date of birth'),
  }).describe('Teacher Information'),
  salaryDetails: z.object({
    dateOfJoiningAsSpecificTeacher: z.string().describe('Date of joining as specific teacher'),
    dateOfTraining: z.string().describe('Date of training'),
    efficiencyType: z.string().describe('Efficiency type'),
    bankDetails: z.string().describe('Bank details'),
  }).describe('Salary Details'),
  otherDetails: z.object({
    dateOfFirstJoiningAsLocalBodyTeacher: z.string().describe('Date of first joining as local body teacher'),
    dateOfReceivingTrainedPayScale: z.string().describe('Date of receiving trained pay scale'),
  }).describe('Other Details'),
});
export type ValidateInputDataInput = z.infer<typeof ValidateInputDataInputSchema>;

const ValidateInputDataOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the input data is valid'),
  validationErrors: z.record(z.string(), z.string()).optional().describe('A map of field names to validation error messages, if any.'),
});
export type ValidateInputDataOutput = z.infer<typeof ValidateInputDataOutputSchema>;

export async function validateInputData(input: ValidateInputDataInput): Promise<ValidateInputDataOutput> {
  return validateInputDataFlow(input);
}

const validateInputDataPrompt = ai.definePrompt({
  name: 'validateInputDataPrompt',
  input: {schema: ValidateInputDataInputSchema},
  output: {schema: ValidateInputDataOutputSchema},
  prompt: `You are an AI data validator. Review the following data and determine if it is valid. If there are any errors, identify them.

Office Details:
Office: {{{officeDetails.office}}}
District Education Officer: {{{officeDetails.districtEducationOfficer}}}
District: {{{officeDetails.district}}}

Teacher Information:
Teacher Name: {{{teacherInfo.teacherName}}}
School Name: {{{teacherInfo.schoolName}}}
U-DISE Code: {{{teacherInfo.udiseCode}}}
Class: {{{teacherInfo.className}}}
Subject: {{{teacherInfo.subject}}}
Appointment Category: {{{teacherInfo.appointmentCategory}}}
Date of Birth: {{{teacherInfo.dateOfBirth}}}

Salary Details:
Date of Joining as Specific Teacher: {{{salaryDetails.dateOfJoiningAsSpecificTeacher}}}
Date of Training: {{{salaryDetails.dateOfTraining}}}
Efficiency Type: {{{salaryDetails.efficiencyType}}}
Bank Details: {{{salaryDetails.bankDetails}}}

Other Details:
Date of First Joining as Local Body Teacher: {{{otherDetails.dateOfFirstJoiningAsLocalBodyTeacher}}}
Date of Receiving Trained Pay Scale: {{{otherDetails.dateOfReceivingTrainedPayScale}}}

Respond with a JSON object. Set isValid to true if all the data is valid. If there are any validation errors, set isValid to false and provide a validationErrors object with field names as keys and error messages as values.  If the input looks valid, do not provide validationErrors object.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const validateInputDataFlow = ai.defineFlow(
  {
    name: 'validateInputDataFlow',
    inputSchema: ValidateInputDataInputSchema,
    outputSchema: ValidateInputDataOutputSchema,
  },
  async input => {
    const {output} = await validateInputDataPrompt(input);
    return output!;
  }
);

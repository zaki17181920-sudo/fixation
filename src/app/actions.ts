'use server';

import {
  validateInputData,
  type ValidateInputDataInput,
} from '@/ai/flows/validate-input-data';
import { formSchema, type FormValues } from '@/lib/schema';
import { format } from 'date-fns';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

type AIValidationResult = {
  success: boolean;
  errors?: Record<string, unknown>;
};

function toSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function buildAIInput(data: FormValues): ValidateInputDataInput {
  const {
    office,
    districtEducationOfficer,
    district,
    teacherName,
    schoolName,
    udiseCode,
    className,
    subject,
    appointmentCategory,
    dateOfBirth,
    dateOfJoiningAsSpecificTeacher,
    dateOfTraining,
    efficiencyType,
    bankDetails,
    dateOfFirstJoiningAsLocalBodyTeacher,
    dateOfReceivingTrainedPayScale,
  } = data;

  return {
    officeDetails: {
      office,
      districtEducationOfficer,
      district,
    },
    teacherInfo: {
      teacherName,
      schoolName,
      udiseCode,
      className,
      subject,
      appointmentCategory,
      dateOfBirth: format(dateOfBirth, 'yyyy-MM-dd'),
    },
    salaryDetails: {
      dateOfJoiningAsSpecificTeacher: format(
        dateOfJoiningAsSpecificTeacher,
        'yyyy-MM-dd',
      ),
      dateOfTraining: format(dateOfTraining, 'yyyy-MM-dd'),
      efficiencyType,
      bankDetails,
    },
    otherDetails: {
      dateOfFirstJoiningAsLocalBodyTeacher: format(
        dateOfFirstJoiningAsLocalBodyTeacher,
        'yyyy-MM-dd',
      ),
      dateOfReceivingTrainedPayScale: format(
        dateOfReceivingTrainedPayScale,
        'yyyy-MM-dd',
      ),
    },
  };
}


export async function validateFormWithAI(
  data: FormValues,
): Promise<AIValidationResult> {
  const parsedData = formSchema.safeParse(data);

  if (!parsedData.success) {
    console.error('Zod validation failed:', parsedData.error);
    return {
      success: false,
      errors: { form: 'भेजे गए डेटा का प्रारूप अमान्य है।' },
    };
  }
  
  const inputForAI = buildAIInput(parsedData.data);

  try {
    const result = await validateInputData(inputForAI);

    if (result.isValid) {
      return { success: true };
    } else {
       // The AI model returns keys in snake_case, but our form uses camelCase.
       // We need to convert them back.
       const camelCaseErrors: Record<string, unknown> = {};
       if (result.validationErrors) {
         for (const key in result.validationErrors) {
            const camelCaseKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
            camelCaseErrors[camelCaseKey] = result.validationErrors[key];
         }
       }
      return { success: false, errors: camelCaseErrors };
    }
  } catch (error) {
    console.error('AI Validation Error:', error);
    return {
      success: false,
      errors: { form: 'AI सत्यापन के दौरान कोई त्रुटि हुई।' },
    };
  }
}

export async function saveAndValidateForm(
  data: FormValues,
): Promise<AIValidationResult> {
  const parsedData = formSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, errors: parsedData.error.flatten().fieldErrors };
  }

  // First, validate with AI
  const aiValidationResult = await validateFormWithAI(data);
  if (!aiValidationResult.success) {
    return aiValidationResult;
  }

  // If validation is successful, save to Firestore
  try {
    const { firestore } = initializeFirebase();
    
    // Convert dates to string format for Firestore
    const dataToSave = {
      ...parsedData.data,
      dateOfBirth: format(parsedData.data.dateOfBirth, 'yyyy-MM-dd'),
      dateOfJoiningAsSpecificTeacher: format(parsedData.data.dateOfJoiningAsSpecificTeacher, 'yyyy-MM-dd'),
      dateOfTraining: format(parsedData.data.dateOfTraining, 'yyyy-MM-dd'),
      dateOfFirstJoiningAsLocalBodyTeacher: format(parsedData.data.dateOfFirstJoiningAsLocalBodyTeacher, 'yyyy-MM-dd'),
      dateOfReceivingTrainedPayScale: format(parsedData.data.dateOfReceivingTrainedPayScale, 'yyyy-MM-dd'),
      nextIncrementDate: format(parsedData.data.nextIncrementDate, 'yyyy-MM-dd'),
      createdAt: new Date().toISOString(),
    };
    
    await addDoc(collection(firestore, 'payslips'), dataToSave);
    return { success: true };
  } catch (error) {
    console.error('Firestore Error:', error);
    return {
      success: false,
      errors: { form: 'डेटाबेस में सहेजते समय कोई त्रुटि हुई।' },
    };
  }
}

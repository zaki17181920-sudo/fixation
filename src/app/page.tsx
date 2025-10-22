'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Loader2, Printer } from 'lucide-react';
import { SalaryForm } from '@/components/salary-form';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { saveAndValidateForm, validateFormWithAI } from './actions';
import { FirebaseClientProvider } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { payMatrix } from '@/lib/pay-matrix';
import { fitmentMatrix } from '@/lib/fitment-matrix';
import { schoolData } from '@/lib/school-data';
import { PrintPreview } from '@/components/print-preview';

export default function SalaryFormEditorPage() {
  const [isValidationPending, startValidationTransition] = React.useTransition();
  const [isSavePending, startSaveTransition] = React.useTransition();
  const [printData, setPrintData] = React.useState<FormValues | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pran: '',
      competencyApplicationNumber: '',
      teacherName: '',
      schoolName: '',
      udiseCode: '',
      className: '',
      subject: '',
      appointmentCategory: '',
      bankDetails: '',
      efficiencyType: '',
      ifscCode: '',
      bankAccountNumber: '',
      serviceBreak: 'नहीं',
      december2024Salary: '',
      newSalaryWithIncrement: '',
      payMatrixSalary: '',
      block: '',
    },
  });

  const dateOfJoiningAsSpecificTeacher = useWatch({
    control: form.control,
    name: 'dateOfJoiningAsSpecificTeacher',
  });

  const dateOfTraining = useWatch({
    control: form.control,
    name: 'dateOfTraining',
  });

  const december2024Salary = useWatch({ control: form.control, name: 'december2024Salary' });
  const newSalaryWithIncrement = useWatch({ control: form.control, name: 'newSalaryWithIncrement' });
  const selectedClass = useWatch({ control: form.control, name: 'className' });

  const udiseCode = useWatch({ control: form.control, name: 'udiseCode' });

  React.useEffect(() => {
    if (udiseCode && schoolData[udiseCode]) {
      const { name, block } = schoolData[udiseCode];
      form.setValue('schoolName', name, { shouldValidate: true });
      form.setValue('block', block, { shouldValidate: true });
    }
  }, [udiseCode, form]);

  React.useEffect(() => {
    if (dateOfTraining) {
      form.setValue('dateOfReceivingTrainedPayScale', dateOfTraining, { shouldValidate: true });
    }
  }, [dateOfTraining, form]);

  React.useEffect(() => {
    if (dateOfJoiningAsSpecificTeacher) {
      form.setValue('dateOfJoiningForNewSalary', dateOfJoiningAsSpecificTeacher, { shouldValidate: true });
    }
  }, [dateOfJoiningAsSpecificTeacher, form]);

  
  // Calculate Box 2 based on Box 1
  React.useEffect(() => {
    const salaryNum = parseInt(december2024Salary, 10);
    if (isNaN(salaryNum)) {
      form.setValue('newSalaryWithIncrement', '');
      return;
    }

    let foundLevel: number | null = null;
    let foundIndex: number | null = null;

    // Find the salary in the payMatrix (Anulagnak-Kha)
    for (const level in payMatrix) {
      const gradePay = parseInt(level, 10);
      const salaries = payMatrix[gradePay];
      const salaryValues = Object.values(salaries);
      const index = salaryValues.indexOf(salaryNum);
      
      if (index !== -1) {
        foundLevel = gradePay;
        // The keys in payMatrix are strings, so we need to find the key for the found index
        const foundKey = Object.keys(salaries).find(key => salaries[parseInt(key)] === salaryNum);
        if(foundKey) {
            foundIndex = parseInt(foundKey);
        }
        break;
      }
    }
    
    if (foundLevel !== null && foundIndex !== null) {
      const nextIndex = foundIndex + 1;
      const nextSalary = payMatrix[foundLevel][nextIndex];
      if (nextSalary !== undefined) {
        form.setValue('newSalaryWithIncrement', String(nextSalary), { shouldValidate: true });
      } else {
        form.setValue('newSalaryWithIncrement', 'N/A', { shouldValidate: true }); // Or some other indicator for max
      }
    } else {
      form.setValue('newSalaryWithIncrement', '', { shouldValidate: true });
    }
  }, [december2024Salary, form]);

// Calculate Box 3 based on Box 2 and selected class
React.useEffect(() => {
    if (!newSalaryWithIncrement || !selectedClass || isNaN(parseInt(newSalaryWithIncrement, 10))) {
        form.setValue('payMatrixSalary', '');
        return;
    }

    const newSalaryNum = parseInt(newSalaryWithIncrement, 10);

    const classToFitmentLevel: Record<string, number> = {
        '1-5': 2,
        '6-8': 3,
        '9-10': 5,
        '11-12': 6,
    };
    const targetFitmentLevel = classToFitmentLevel[selectedClass];
    
    if (!targetFitmentLevel || !fitmentMatrix[targetFitmentLevel]) {
      form.setValue('payMatrixSalary', '');
      return;
    }

    const targetSalaries = Object.values(fitmentMatrix[targetFitmentLevel]);

    // Find the salary in the target fitment matrix that is just >= newSalaryWithIncrement
    let bestMatchSalary = targetSalaries.find(salary => salary >= newSalaryNum);

    if (bestMatchSalary !== undefined) {
        form.setValue('payMatrixSalary', String(bestMatchSalary), { shouldValidate: true });
    } else {
        // If no salary is found (e.g., new salary is higher than all in matrix), use the max salary from that level.
        if (targetSalaries.length > 0) {
            const maxSalary = Math.max(...targetSalaries);
            form.setValue('payMatrixSalary', String(maxSalary), { shouldValidate: true });
        } else {
            form.setValue('payMatrixSalary', '', { shouldValidate: true });
        }
    }

}, [newSalaryWithIncrement, selectedClass, form]);


  React.useEffect(() => {
    if (dateOfJoiningAsSpecificTeacher) {
      const joiningDate = new Date(dateOfJoiningAsSpecificTeacher);
      const joiningYear = joiningDate.getFullYear();
      const joiningMonth = joiningDate.getMonth();
      const joiningDay = joiningDate.getDate();

      let nextIncrementDate;

      // This logic seems incorrect based on standard rules (July 1st), but keeping as is.
      // Standard rule: If joined between Jan 2 and July 1, increment is on Jan 1 of next year.
      // If joined between July 2 and Jan 1, increment is on July 1 of next year.
      // The current logic is simpler.
      if (joiningMonth === 0 && joiningDay === 1) { // If joining is Jan 1st
        nextIncrementDate = new Date(joiningYear, 6, 1); // Next increment is July 1st of same year
      } else if (joiningMonth < 6 || (joiningMonth === 6 && joiningDay === 1)) { // If joining is between Jan 2nd and July 1st
         nextIncrementDate = new Date(joiningYear + 1, 0, 1); // Next increment is Jan 1st of next year
      }
      else { // If joining is after July 1st
        nextIncrementDate = new Date(joiningYear + 1, 6, 1); // Next increment is July 1st of next year
      }
      
      form.setValue('nextIncrementDate', nextIncrementDate, {
        shouldValidate: true,
      });
    }
  }, [dateOfJoiningAsSpecificTeacher, form]);


  const handlePrint = () => {
    const data = form.getValues();
    const parsedData = formSchema.safeParse(data);

    if (!parsedData.success) {
      // If validation fails, show toast with errors
      const errorMessages = Object.values(parsedData.error.flatten().fieldErrors).flat().join('\n');
      toast({
        variant: 'destructive',
        title: 'अमान्य डेटा',
        description: errorMessages || 'कृपया फॉर्म में सभी आवश्यक फ़ील्ड भरें।',
      });
      return;
    }

    setPrintData(parsedData.data);
    setTimeout(() => {
      window.print();
      setPrintData(null); // Clear data after print dialog opens
    }, 100);
  };


  return (
    <FirebaseClientProvider>
      <div id="form-container" className="container mx-auto p-4 md:p-8 no-print">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <Logo />
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handlePrint}>
              <Printer />
              प्रिंट
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <SalaryForm form={form} />
        </main>
      </div>
      {printData && (
        <div id="print-area" className="hidden print:block">
          <PrintPreview data={printData} />
        </div>
      )}
    </FirebaseClientProvider>
  );
}

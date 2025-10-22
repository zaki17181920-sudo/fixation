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
    if (!december2024Salary) {
        form.setValue('newSalaryWithIncrement', '');
        return;
    }

    const salaryNum = parseInt(december2024Salary, 10);
    if (isNaN(salaryNum)) {
        form.setValue('newSalaryWithIncrement', '', { shouldValidate: true });
        return;
    }

    let foundLevel: number | null = null;
    let foundIndex: number | null = null;

    // Find the salary in the payMatrix (Anulagnak-Kha)
    for (const level in payMatrix) {
        const gradePay = parseInt(level, 10);
        const salaries = payMatrix[gradePay];
        for (const index in salaries) {
            if (salaries[parseInt(index, 10)] === salaryNum) {
                foundLevel = gradePay;
                foundIndex = parseInt(index, 10);
                break;
            }
        }
        if (foundLevel !== null) break;
    }

    if (foundLevel !== null && foundIndex !== null) {
        // Calculate next increment (Box 2)
        const nextIndex = foundIndex + 1;
        const nextSalary = payMatrix[foundLevel][nextIndex];
        if (nextSalary !== undefined) {
            form.setValue('newSalaryWithIncrement', String(nextSalary), { shouldValidate: true });
        } else {
            form.setValue('newSalaryWithIncrement', '', { shouldValidate: true });
        }
    } else {
        form.setValue('newSalaryWithIncrement', '', { shouldValidate: true });
    }
}, [december2024Salary, form]);

// Calculate Box 3 based on Box 2 and selected class
React.useEffect(() => {
    if (!newSalaryWithIncrement || !selectedClass) {
        form.setValue('payMatrixSalary', '');
        return;
    }

    const newSalaryNum = parseInt(newSalaryWithIncrement, 10);
    if (isNaN(newSalaryNum)) {
        form.setValue('payMatrixSalary', '');
        return;
    }

    // Mapping class to fitment matrix level (Anulagnak-Ka)
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

    const targetSalaries = fitmentMatrix[targetFitmentLevel];
    const salaryValues = Object.values(targetSalaries);

    // Find the salary in the target fitment matrix that is just >= newSalaryWithIncrement
    let bestMatchSalary = salaryValues.find(salary => salary >= newSalaryNum);

    if (bestMatchSalary !== undefined) {
        form.setValue('payMatrixSalary', String(bestMatchSalary), { shouldValidate: true });
    } else {
        // If no salary is found (e.g., new salary is higher than all in matrix), use the max salary from that level.
        if (salaryValues.length > 0) {
            const maxSalary = Math.max(...salaryValues);
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

      if (joiningMonth === 0 && joiningDay === 1) {
        nextIncrementDate = new Date(joiningYear, 6, 1);
      } else {
        nextIncrementDate = new Date(joiningYear + 1, 0, 1);
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

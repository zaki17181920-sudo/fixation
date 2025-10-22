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
      levelForDecember2024Salary: '',
      indexForDecember2024Salary: '',
      levelForNewSalary: '',
      indexForNewSalary: '',
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

  const levelForDecember = useWatch({ control: form.control, name: 'levelForDecember2024Salary' });
  const indexForDecember = useWatch({ control: form.control, name: 'indexForDecember2024Salary' });
  
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

  
  React.useEffect(() => {
    if (!newSalaryWithIncrement || !levelForDecember) return;
  
    const newSalaryNum = parseInt(newSalaryWithIncrement, 10);
    if (isNaN(newSalaryNum)) return;
    
    // As per the requirement, we need to find the salary in one level *below*
    // the current level for pay protection.
    const currentLevelNum = parseInt(levelForDecember, 10);
    if (isNaN(currentLevelNum) || currentLevelNum <= 1) return; // Cannot go a level below 1
    
    const fitmentLevel = currentLevelNum - 1;

    // Mapping grade pay to fitment matrix level
    // Assuming level 1 -> 0 grade pay, 2 -> 2000, 3 -> 2400, 4-> 2800 (from payMatrix)
    // and fitment matrix levels are 2, 3, 4, 5, 6, 7
    // The requirement is to go one level down.
    // Example: If current level is 3 (2400 GP), we look at fitment level 2 (I-V).
    const classToFitmentLevel: Record<string, number> = {
        '1-5': 2,
        '6-8': 3,
        '9-10': 5,
        '11-12': 6,
    };
    const targetFitmentLevel = classToFitmentLevel[selectedClass];

    if (!targetFitmentLevel || !fitmentMatrix[targetFitmentLevel]) return;
  
    const targetSalaries = fitmentMatrix[targetFitmentLevel];
    let bestMatchSalary = Infinity;
    
    // Find the salary in the target fitment matrix that is just >= newSalaryWithIncrement
    for (const key in targetSalaries) {
        const currentSalary = targetSalaries[key];
        if (currentSalary >= newSalaryNum && currentSalary < bestMatchSalary) {
            bestMatchSalary = currentSalary;
        }
    }
  
    if (bestMatchSalary !== Infinity) {
        form.setValue('payMatrixSalary', String(bestMatchSalary), { shouldValidate: true });
    } else {
        // If no salary is found (e.g., new salary is higher than all in matrix), find the max
        const salaryValues = Object.values(targetSalaries);
        if (salaryValues.length > 0) {
            const maxSalary = Math.max(...salaryValues);
            // If the new salary is even higher than the max, use the max.
            form.setValue('payMatrixSalary', String(newSalaryNum > maxSalary ? maxSalary : newSalaryNum), { shouldValidate: true });
        }
    }
  
  }, [newSalaryWithIncrement, levelForDecember, selectedClass, form]);
  


  React.useEffect(() => {
    if (levelForDecember && indexForDecember) {
      const levelMap: { [key: string]: number } = { '1': 0, '2': 2000, '3': 2400, '4': 2800 };
      const gradePay = levelMap[levelForDecember];
      const index = parseInt(indexForDecember, 10);

      if (gradePay !== undefined && !isNaN(index) && payMatrix[gradePay] && payMatrix[gradePay][index] !== undefined) {
        const baseSalary = payMatrix[gradePay][index];
        form.setValue('december2024Salary', String(baseSalary), { shouldValidate: true });

        // Calculate next increment (Box 2)
        const nextIndex = index + 1;
        if (payMatrix[gradePay][nextIndex] !== undefined) {
          const incrementedSalary = payMatrix[gradePay][nextIndex];
          form.setValue('newSalaryWithIncrement', String(incrementedSalary), { shouldValidate: true });
        } else {
           form.setValue('newSalaryWithIncrement', '', { shouldValidate: true });
           form.setValue('payMatrixSalary', '', { shouldValidate: true });
        }
      } else {
        form.setValue('december2024Salary', '', { shouldValidate: true });
        form.setValue('newSalaryWithIncrement', '', { shouldValidate: true });
        form.setValue('payMatrixSalary', '', { shouldValidate: true });
      }
    }
  }, [levelForDecember, indexForDecember, form]);


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
    setPrintData(data);
    setTimeout(() => {
      window.print();
    }, 100);
  };


  return (
    <FirebaseClientProvider>
      <div id="form-container" className="container mx-auto p-4 md:p-8 no-print">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <Logo />
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handlePrint} disabled={isSavePending}>
              {isSavePending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Printer />
              )}
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

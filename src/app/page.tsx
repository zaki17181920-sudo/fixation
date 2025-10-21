'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, Save, ShieldCheck } from 'lucide-react';
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
  
  const oldSalary = useWatch({ control: form.control, name: 'december2024Salary' });

  const udiseCode = useWatch({ control: form.control, name: 'udiseCode' });

  React.useEffect(() => {
    if (udiseCode && schoolData[udiseCode]) {
      const { name, block } = schoolData[udiseCode];
      form.setValue('schoolName', name, { shouldValidate: true });
      form.setValue('block', block, { shouldValidate: true });
    }
  }, [udiseCode, form, schoolData]);

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
    if (!oldSalary || !levelForDecember) return;
  
    const oldSalaryNum = parseInt(oldSalary, 10);
    const oldLevelNum = parseInt(levelForDecember, 10);
    if (isNaN(oldSalaryNum) || isNaN(oldLevelNum)) return;
  
    const targetFitmentLevel = oldLevelNum; 
    
    const targetSalaries = fitmentMatrix[targetFitmentLevel];
    if (!targetSalaries) return;
    
    let bestMatch = {
        level: '',
        index: '',
        salary: Infinity,
    };
  
    for (const index in targetSalaries) {
        const currentSalary = targetSalaries[index];
        if (currentSalary >= oldSalaryNum && currentSalary < bestMatch.salary) {
            bestMatch = {
                level: String(targetFitmentLevel), 
                index: index,
                salary: currentSalary,
            };
            break;
        }
    }
    
    if (bestMatch.salary !== Infinity) {
        form.setValue('levelForNewSalary', String(Number(bestMatch.level) - 1), { shouldValidate: true });
        form.setValue('indexForNewSalary', bestMatch.index, { shouldValidate: true });
        form.setValue('newSalaryWithIncrement', String(bestMatch.salary), { shouldValidate: true });
    } else {
        let maxSalary = 0;
        let maxIndex = '';
        for (const index in targetSalaries) {
            if (targetSalaries[index] > maxSalary) {
                maxSalary = targetSalaries[index];
                maxIndex = index;
            }
        }
        if (maxSalary > 0) {
            form.setValue('levelForNewSalary', String(targetFitmentLevel - 1), { shouldValidate: true });
            form.setValue('indexForNewSalary', maxIndex, { shouldValidate: true });
            form.setValue('newSalaryWithIncrement', String(maxSalary), { shouldValidate: true });
        }
    }
  }, [oldSalary, levelForDecember, form]);

  React.useEffect(() => {
    if (levelForDecember && indexForDecember) {
      const levelMap: { [key: string]: number } = {
        '1': 0,
        '2': 2000,
        '3': 2400,
        '4': 2800,
      };
      const levelKey = levelForDecember;
      const index = parseInt(indexForDecember, 10);

      if (levelMap[levelKey] !== undefined && !isNaN(index) && index >= 0) {
        const gradePay = levelMap[levelKey];
        if (payMatrix[gradePay] && payMatrix[gradePay][index] !== undefined) {
            const salary = payMatrix[gradePay][index];
            form.setValue('december2024Salary', String(salary), { shouldValidate: true });
        } else {
            form.setValue('december2024Salary', '', { shouldValidate: true });
        }
      } else {
        form.setValue('december2024Salary', '', { shouldValidate: true });
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
        <div className="hidden print:block">
          <PrintPreview data={printData} />
        </div>
      )}
    </FirebaseClientProvider>
  );
}

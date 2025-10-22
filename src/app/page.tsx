
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
import { payMatrix } from '@/lib/pay-matrix';
import { fitmentMatrix } from '@/lib/fitment-matrix';
import { schoolData } from '@/lib/school-data';
import { PrintPreview } from '@/components/print-preview';
import Link from 'next/link';

export default function SalaryFormEditorPage() {
  const [isSavePending, startSaveTransition] = React.useTransition();
  const { toast } = useToast();
  const [printData, setPrintData] = React.useState<FormValues | null>(null);

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

  const { control, setValue } = form;

  const dateOfJoiningAsSpecificTeacher = useWatch({ control, name: 'dateOfJoiningAsSpecificTeacher' });
  const dateOfTraining = useWatch({ control, name: 'dateOfTraining' });
  const december2024Salary = useWatch({ control, name: 'december2024Salary' });
  const newSalaryWithIncrement = useWatch({ control, name: 'newSalaryWithIncrement' });
  const selectedClass = useWatch({ control, name: 'className' });
  const udiseCode = useWatch({ control, name: 'udiseCode' });

  React.useEffect(() => {
    if (udiseCode && schoolData[udiseCode]) {
      const { name, block } = schoolData[udiseCode];
      setValue('schoolName', name, { shouldValidate: true });
      setValue('block', block, { shouldValidate: true });
    }
  }, [udiseCode, setValue]);

  React.useEffect(() => {
    if (dateOfTraining) {
      setValue('dateOfReceivingTrainedPayScale', dateOfTraining, { shouldValidate: true });
    }
  }, [dateOfTraining, setValue]);

  React.useEffect(() => {
    if (dateOfJoiningAsSpecificTeacher) {
      setValue('dateOfJoiningForNewSalary', dateOfJoiningAsSpecificTeacher, { shouldValidate: true });
    }
  }, [dateOfJoiningAsSpecificTeacher, setValue]);

  React.useEffect(() => {
    const salaryNum = parseInt(december2024Salary, 10);
    if (isNaN(salaryNum) || !selectedClass) {
      setValue('newSalaryWithIncrement', '');
      return;
    }

    const gradePayMapping: Record<string, number> = {
      '1-5': 2000,
      '6-8': 2400,
      '9-10': 2800,
      '11-12': 2800,
    };
    const gradePay = gradePayMapping[selectedClass];
    if (gradePay === undefined || !payMatrix[gradePay]) {
      setValue('newSalaryWithIncrement', '');
      return;
    }

    const salaryList = payMatrix[gradePay];
    let foundIndex: number | null = null;
    
    for (const key in salaryList) {
      if (salaryList[key] === salaryNum) {
        foundIndex = parseInt(key, 10);
        break;
      }
    }
    
    let calculatedNewSalary = '';
    if (foundIndex !== null) {
      const nextIndex = foundIndex + 1;
      const nextSalary = salaryList[nextIndex];
      if (nextSalary !== undefined) {
        calculatedNewSalary = String(nextSalary);
      } else {
        calculatedNewSalary = 'N/A';
      }
    }
    setValue('newSalaryWithIncrement', calculatedNewSalary, { shouldValidate: true });
  }, [december2024Salary, selectedClass, setValue]);

  React.useEffect(() => {
      const newSalaryNum = parseInt(newSalaryWithIncrement, 10);
      if (isNaN(newSalaryNum) || !selectedClass) {
        setValue('payMatrixSalary', '');
        return;
      }

      const classToFitmentLevel: Record<string, number> = {
          '1-5': 2,
          '6-8': 3,
          '9-10': 5,
          '11-12': 6,
      };
      const targetFitmentLevel = classToFitmentLevel[selectedClass];
      if (!targetFitmentLevel || !fitmentMatrix[targetFitmentLevel]) {
          setValue('payMatrixSalary', '');
          return;
      }

      const targetSalaries = Object.values(fitmentMatrix[targetFitmentLevel]);
      let bestMatchSalary = targetSalaries.find(salary => salary >= newSalaryNum);

      if (bestMatchSalary !== undefined) {
          setValue('payMatrixSalary', String(bestMatchSalary), { shouldValidate: true });
      } else {
          const maxSalary = Math.max(...targetSalaries);
          setValue('payMatrixSalary', String(maxSalary), { shouldValidate: true });
      }
  }, [newSalaryWithIncrement, selectedClass, setValue]);

  React.useEffect(() => {
    if (dateOfJoiningAsSpecificTeacher) {
      const joiningDate = new Date(dateOfJoiningAsSpecificTeacher);
      const joiningMonth = joiningDate.getMonth();

      let nextIncrementDate;
      if (joiningDate.getTime() > new Date(joiningDate.getFullYear(), 0, 1).getTime() && joiningDate.getTime() <= new Date(joiningDate.getFullYear(), 6, 1).getTime()) {
        nextIncrementDate = new Date(joiningDate.getFullYear() + 1, 0, 1);
      } else {
        nextIncrementDate = new Date(joiningDate.getFullYear() + 1, 6, 1);
      }
      
      setValue('nextIncrementDate', nextIncrementDate, {
        shouldValidate: true,
      });
    }
  }, [dateOfJoiningAsSpecificTeacher, setValue]);
  

  const handlePrint = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'अमान्य डेटा',
        description: 'कृपया फॉर्म में सभी आवश्यक फ़ील्ड सही-सही भरें।',
      });
      return;
    }
    const data = form.getValues();
    setPrintData(data);
    setTimeout(() => {
        window.print();
        setPrintData(null);
    }, 100);
  }

  return (
    <>
      <div id="form-container" className="container mx-auto p-4 md:p-8 no-print">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <Logo />
          <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={handlePrint} disabled={isSavePending}>
                {isSavePending ? <Loader2 className="animate-spin"/> : <Printer />}
                प्रिंट
              </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <SalaryForm form={form} />
        </main>
      </div>
      {printData && (
        <div id="print-area">
          <PrintPreview data={printData} />
        </div>
      )}
    </>
  );
}

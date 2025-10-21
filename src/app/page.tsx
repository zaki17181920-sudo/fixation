'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, Save, ShieldCheck } from 'lucide-react';
import { SalaryForm } from '@/components/salary-form';
import { PrintPreview } from '@/components/print-preview';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { saveAndValidateForm, validateFormWithAI } from './actions';
import { FirebaseClientProvider } from '@/firebase';
import Link from 'next/link';
import { payMatrix } from '@/lib/pay-matrix';
import { fitmentMatrix } from '@/lib/fitment-matrix';

export default function SalaryFormEditorPage() {
  const [isValidationPending, startValidationTransition] = React.useTransition();
  const [isSavePending, startSaveTransition] = React.useTransition();
  const { toast } = useToast();

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

  const watchedData = form.watch();

  const dateOfJoiningAsSpecificTeacher = useWatch({
    control: form.control,
    name: 'dateOfJoiningAsSpecificTeacher',
  });

  const levelForDecember = useWatch({ control: form.control, name: 'levelForDecember2024Salary' });
  const indexForDecember = useWatch({ control: form.control, name: 'indexForDecember2024Salary' });
  
  const oldSalary = useWatch({ control: form.control, name: 'december2024Salary' });

  React.useEffect(() => {
    if (!oldSalary) return;
  
    const oldSalaryNum = parseInt(oldSalary, 10);
    if (isNaN(oldSalaryNum)) return;
  
    let bestMatch = {
      level: '',
      index: '',
      salary: Infinity,
    };
  
    // Iterate through the fitmentMatrix to find the smallest salary >= oldSalary
    for (const level in fitmentMatrix) {
      for (const index in fitmentMatrix[level]) {
        const currentSalary = fitmentMatrix[level][index];
  
        if (currentSalary >= oldSalaryNum && currentSalary < bestMatch.salary) {
          bestMatch = {
            level: level,
            index: index,
            salary: currentSalary,
          };
        }
      }
    }
  
    // If a suitable salary was found, update the form.
    if (bestMatch.salary !== Infinity) {
      // The level in fitment matrix is 2-7, but form expects 1-6. So subtract 1.
      form.setValue('levelForNewSalary', String(Number(bestMatch.level) - 1), { shouldValidate: true });
      form.setValue('indexForNewSalary', bestMatch.index, { shouldValidate: true });
      form.setValue('newSalaryWithIncrement', String(bestMatch.salary), { shouldValidate: true });
    } else {
      // If old salary is higher than any value in the matrix, find the highest possible salary and set it.
      let maxSalary = 0;
      let maxLevel = '';
      let maxIndex = '';
      for (const level in fitmentMatrix) {
          for (const index in fitmentMatrix[level]) {
              if (fitmentMatrix[level][index] > maxSalary) {
                  maxSalary = fitmentMatrix[level][index];
                  maxLevel = level;
                  maxIndex = index;
              }
          }
      }
      form.setValue('levelForNewSalary', String(Number(maxLevel) - 1), { shouldValidate: true });
      form.setValue('indexForNewSalary', maxIndex, { shouldValidate: true });
      form.setValue('newSalaryWithIncrement', String(maxSalary), { shouldValidate: true });
    }
  
  }, [oldSalary, form]);

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

      if (levelMap[levelKey] !== undefined && !isNaN(index) && index >= 0) { // Changed index > 0 to index >= 0 to include index 0
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

      // Rule: if joining date is 1st Jan of any year, next increment is 1st July of same year.
      if (joiningMonth === 0 && joiningDay === 1) {
        nextIncrementDate = new Date(joiningYear, 6, 1);
      } else {
      // if joining date is after 2nd Jan of any year, next increment is 1st Jan of next year.
        nextIncrementDate = new Date(joiningYear + 1, 0, 1);
      }
      
      form.setValue('nextIncrementDate', nextIncrementDate, {
        shouldValidate: true,
      });
    }
  }, [dateOfJoiningAsSpecificTeacher, form]);


  const handlePrint = () => {
    window.print();
  };

  const handleValidation = async (data: FormValues) => {
    startValidationTransition(async () => {
      const result = await validateFormWithAI(data);

      if (result.success) {
        toast({
          title: 'सत्यापन सफल',
          description: 'डेटा वैध प्रतीत होता है।',
          variant: 'default',
        });
      } else {
        toast({
          title: 'सत्यापन में त्रुटियाँ',
          description: 'कृपया हाइलाइट किए गए फ़ील्ड की समीक्षा करें।',
          variant: 'destructive',
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, message]) => {
            // Flatten nested keys for react-hook-form
            let fieldKey = key as keyof FormValues;
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                // This is a simple flattening logic. It might need to be more robust.
                const keyMap: { [key: string]: string } = {
                  'officeDetails.office': 'office',
                  'teacherInfo.teacherName': 'teacherName',
                  'teacherInfo.schoolName': 'schoolName',
                   // ... and so on for all fields
                };
                fieldKey = (keyMap[key] || key) as keyof FormValues;
            }

            if (fieldKey in form.getValues()){
                 form.setError(fieldKey, {
                    type: 'manual',
                    message: message as string,
                });
            }
          });
        }
      }
    });
  };

  const handleSave = async (data: FormValues) => {
    startSaveTransition(async () => {
      const result = await saveAndValidateForm(data);

      if (result.success) {
        toast({
          title: 'सफलतापूर्वक सहेजा गया',
          description: 'आपका डेटा सफलतापूर्वक सहेज लिया गया है।',
          variant: 'default',
        });
        form.reset();
      } else {
        toast({
          title: 'त्रुटि सहेजी जा रही है',
          description: result.errors?.form || 'डेटा सहेजते समय एक त्रुटि हुई।',
          variant: 'destructive',
        });
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, message]) => {
            if (key !== 'form' && key in form.getValues()) {
              form.setError(key as keyof FormValues, {
                type: 'manual',
                message: message as string,
              });
            }
          });
        }
      }
    });
  };


  return (
    <FirebaseClientProvider>
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4 no-print">
          <Logo />
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={form.handleSubmit(handleSave)}
              disabled={isSavePending}
            >
              {isSavePending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              सहेजें
            </Button>
            <Button
              onClick={form.handleSubmit(handleValidation)}
              disabled={isValidationPending}
            >
              {isValidationPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              सत्यापित करें
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> प्रिंट करें
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-2 gap-8">
          <div className="lg:col-span-3 xl:col-span-1 no-print">
            <SalaryForm form={form} />
          </div>
          <div className="lg:col-span-2 xl:col-span-1">
            <h2 className="text-2xl font-bold mb-4 font-headline no-print">
              प्रिंट पूर्वावलोकन
            </h2>
            <div className="rounded-lg shadow-lg bg-white">
              <PrintPreview data={watchedData} />
            </div>
          </div>
        </main>
      </div>
    </FirebaseClientProvider>
  );
}

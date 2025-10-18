'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormValues } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Loader2, Printer, ShieldCheck } from 'lucide-react';
import { SalaryForm } from '@/components/salary-form';
import { PrintPreview } from '@/components/print-preview';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { validateFormWithAI } from './actions';

export default function SalaryFormEditorPage() {
  const [isValidationPending, startValidationTransition] = React.useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pran: '',
      competencyApplicationNumber: '',
      office: '',
      districtEducationOfficer: 'जिला शिक्षा पदाधिकारी, मुजफ्फरपुर',
      district: 'मुजफ्फरपुर',
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
    },
  });

  const watchedData = form.watch();

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

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4 no-print">
          <Logo />
          <div className="flex items-center gap-2">
            <Button
              onClick={form.handleSubmit(handleValidation)}
              disabled={isValidationPending}
            >
              {isValidationPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 h-4 w-4" />
              )}
              AI से सत्यापित करें
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
    </>
  );
}

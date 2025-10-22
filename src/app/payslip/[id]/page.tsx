'use client';

import * as React from 'react';
import {
  doc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';
import {
  FirebaseClientProvider,
  useDoc,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import { PrintPreview } from '@/components/print-preview';
import { Loader2 } from 'lucide-react';
import type { PaySlip } from '@/lib/schema';
import { Button } from '@/components/ui/button';

// Helper to convert string dates back to Date objects for PrintPreview
const parsePaySlipDates = (data: PaySlip | undefined) => {
    if (!data) return undefined;
    
    const parseDate = (dateString: string | undefined) => {
        if (!dateString) return new Date(NaN); // Invalid date
        // Handles both dd-MM-yyyy and yyyy-MM-dd
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const [p1, p2, p3] = parts;
            if (p1.length === 4) { // yyyy-MM-dd
                return new Date(dateString);
            }
             // dd-MM-yyyy
            return new Date(`${p3}-${p2}-${p1}`);
        }
        return new Date(dateString); // Fallback for ISO strings or other formats
    }

    return {
        ...data,
        dateOfBirth: parseDate(data.dateOfBirth),
        dateOfJoiningAsSpecificTeacher: parseDate(data.dateOfJoiningAsSpecificTeacher),
        dateOfTraining: parseDate(data.dateOfTraining),
        dateOfPassingEfficiency: parseDate(data.dateOfPassingEfficiency),
        dateOfFirstJoiningAsLocalBodyTeacher: parseDate(data.dateOfFirstJoiningAsLocalBodyTeacher),
        dateOfReceivingTrainedPayScale: parseDate(data.dateOfReceivingTrainedPayScale),
        dateOfJoiningForNewSalary: parseDate(data.dateOfJoiningForNewSalary),
        nextIncrementDate: parseDate(data.nextIncrementDate),
    };
}


function PayslipPrintPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  
  const payslipRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'payslips', params.id);
  }, [firestore, params.id]) as DocumentReference<DocumentData> | null;

  const { data: payslip, isLoading, error } = useDoc<PaySlip>(payslipRef);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg">वेतन पर्ची लोड हो रही है...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-destructive text-center">
        त्रुटि: {error.message}
      </div>
    );
  }

  if (!payslip) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
         <p className="text-destructive text-lg mb-4">वेतन पर्ची नहीं मिली।</p>
      </div>
    );
  }
  
  const formattedData = parsePaySlipDates(payslip);

  return (
    <div>
        <div id="print-area">
          <PrintPreview data={formattedData as any} />
        </div>
        <div className="absolute top-4 right-4 no-print">
            <Button onClick={() => window.print()}>प्रिंट</Button>
        </div>
    </div>
  );
}


export default function PayslipPageWrapper({ params }: { params: { id: string } }) {
    return (
        <FirebaseClientProvider>
            <PayslipPrintPage params={params} />
        </FirebaseClientProvider>
    )
}

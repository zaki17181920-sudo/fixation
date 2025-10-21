'use client';

import React from 'react';
import {
  collection,
  query,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import {
  FirebaseClientProvider,
  useCollection,
  useFirestore,
  useMemoFirebase,
  WithId,
} from '@/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Printer } from 'lucide-react';
import type { PaySlip } from '@/lib/schema';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function PaySlipsList() {
  const firestore = useFirestore();
  const router = useRouter();

  const payslipsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'payslips'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const { data: payslips, isLoading, error } = useCollection<PaySlip>(payslipsQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center">
        त्रुटि: {error.message}
      </div>
    );
  }

  if (!payslips || payslips.length === 0) {
    return <p className="text-center text-muted-foreground">कोई वेतन पर्ची नहीं मिली।</p>;
  }

  const handlePrint = (id: string) => {
    router.push(`/payslip/${id}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>शिक्षक का नाम</TableHead>
          <TableHead>विद्यालय का नाम</TableHead>
          <TableHead>यू-डायस कोड</TableHead>
          <TableHead>आवेदन संख्या</TableHead>
          <TableHead className="text-right">प्रिंट</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payslips.map((slip) => (
          <TableRow key={slip.id}>
            <TableCell>{slip.teacherName}</TableCell>
            <TableCell>{slip.schoolName}</TableCell>
            <TableCell>{slip.udiseCode}</TableCell>
            <TableCell>{slip.competencyApplicationNumber}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => handlePrint(slip.id)}>
                <Printer className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function PaySlipsPage() {
  return (
    <FirebaseClientProvider>
      <div className="container mx-auto p-4 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>सहेजी गई वेतन पर्चियाँ</CardTitle>
            <Button asChild>
                <Link href="/">नई पर्ची बनाएं</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <PaySlipsList />
          </CardContent>
        </Card>
      </div>
    </FirebaseClientProvider>
  );
}

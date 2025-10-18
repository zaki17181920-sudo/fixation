'use client';

import type { FormValues } from '@/lib/schema';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';

type PrintPreviewProps = {
  data: FormValues;
};

const DataRow = ({ label, value }: { label: string; value?: string | Date }) => {
  if (!value) return null;
  
  let displayValue: string;
  if (value instanceof Date) {
    displayValue = format(value, 'dd MMMM yyyy', { locale: hi });
  } else {
    displayValue = value;
  }

  return (
    <div className="flex border-b py-2">
      <p className="w-1/2 font-medium text-gray-600">{label}</p>
      <p className="w-1/2">{displayValue || '-'}</p>
    </div>
  );
};

export function PrintPreview({ data }: PrintPreviewProps) {
  return (
    <div id="print-area" className="p-8 bg-white text-black font-body">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold font-headline">वेतन प्रपत्र</h1>
        <p className="text-lg">सक्षमता परीक्षा उत्तीर्ण विशिष्ट शिक्षकों के वेतन निर्धारण हेतु</p>
      </header>

      <main>
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 font-headline">कार्यालय विवरण</h2>
          <DataRow label="कार्यालय" value={data.office} />
          <DataRow label="जिला शिक्षा पदाधिकारी" value={data.districtEducationOfficer} />
          <DataRow label="जिला" value={data.district} />
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 font-headline">शिक्षक सूचना</h2>
          <DataRow label="शिक्षक का नाम" value={data.teacherName} />
          <DataRow label="विद्यालय का नाम" value={data.schoolName} />
          <DataRow label="यू-डायस कोड" value={data.udiseCode} />
          <DataRow label="वर्ग" value={data.className} />
          <DataRow label="विषय" value={data.subject} />
          <DataRow label="नियुक्ति कोटि" value={data.appointmentCategory} />
          <DataRow label="जन्म तिथि" value={data.dateOfBirth} />
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 font-headline">वेतन विवरण</h2>
          <DataRow label="विशिष्ट शिक्षक के रूप में योगदान तिथि" value={data.dateOfJoiningAsSpecificTeacher} />
          <DataRow label="प्रशिक्षण तिथि" value={data.dateOfTraining} />
          <DataRow label="दक्षता प्रकार" value={data.efficiencyType} />
          <DataRow label="बैंक विवरण" value={data.bankDetails} />
        </section>

        <section>
          <h2 className="text-xl font-bold border-b-2 border-black pb-2 mb-4 font-headline">अन्य विवरण</h2>
          <DataRow label="स्थानीय निकाय शिक्षक के रूप में प्रथम योगदान तिथि" value={data.dateOfFirstJoiningAsLocalBodyTeacher} />
          <DataRow label="प्रशिक्षित वेतनमान प्राप्ति तिथि" value={data.dateOfReceivingTrainedPayScale} />
        </section>

        <footer className="mt-16 text-sm text-gray-500">
            <div className="flex justify-between">
                <div className="mt-8">
                    <p className="border-t pt-2">हस्ताक्षर</p>
                </div>
                 <div className="mt-8">
                    <p className="border-t pt-2">कार्यालय का मुहर</p>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}

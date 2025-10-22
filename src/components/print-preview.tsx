'use client';

import * as React from 'react';
import type { FormValues } from '@/lib/schema';
import { format } from 'date-fns';

type PrintPreviewProps = {
  data: FormValues;
};

const DataRow = ({ label, value, number, subLabel }: { label: string; value?: string | Date | number | null; number?: string; subLabel?: string }) => {
  let displayValue: string;
  if (value instanceof Date && !isNaN(value.getTime())) {
    try {
      displayValue = format(value, 'dd-MM-yyyy');
    } catch (e) {
      displayValue = '..............................';
    }
  } else if (value) {
    displayValue = String(value);
  } else {
    displayValue = '..............................';
  }

  return (
    <>
      <tr>
        <td className="py-1 pr-2 w-8 align-top">{number}</td>
        <td className="py-1 pr-2 font-medium align-top w-2/5">{label}</td>
        <td className="w-4 py-1 text-center align-top">:</td>
        <td className="w-auto py-1 font-body uppercase">{displayValue}</td>
      </tr>
      {subLabel && (
        <tr>
          <td colSpan={4} className="text-[10px] pl-8 pb-1 pt-0 normal-case">
            {subLabel}
          </td>
        </tr>
      )}
    </>
  );
};


export const PrintPreview = React.forwardRef<HTMLDivElement, PrintPreviewProps>(({ data }, ref) => {
  const formatDate = (date: Date | undefined | null) => {
    if (!date || isNaN(new Date(date).getTime())) return '..............................';
    try {
      return format(new Date(date), 'dd-MM-yyyy');
    } catch (error) {
      return '..............................';
    }
  }

  return (
    <div ref={ref} className="p-10 bg-white text-black font-body text-[13px] leading-tight">
      <header className="text-center mb-4">
        <h1 className="text-[20px] font-bold uppercase">कार्यालय, जिला शिक्षा पदाधिकारी, मुजफ्फरपुर</h1>
        <h2 className="text-[18px] font-bold uppercase">(स्थापना-शाखा)</h2>
        <p className="text-[14px] mt-2 max-w-3xl mx-auto">
          निदेशक (मा.शि.), शिक्षा विभाग, बिहार सरकार, पटना के पत्रांक-2999, दिनांक 14.10.2025 एवं जिला कार्यक्रम पदाधिकारी, स्थापना, मुजफ्फरपुर के पत्रांक 5876, मुजफ्फरपुर दिनांक 15.02.2025 के आलोक में
        </p>
        <h3 className="text-[16px] font-bold uppercase mt-2 underline">विशिष्ट शिक्षकों का वेतन निर्धारण प्रपत्र</h3>
      </header>
      
      <main>
        <div className="flex justify-between uppercase mb-2">
            <span>PRAN NO.:- {data.pran || '..............................'}</span>
            <span>सक्षमता आवेदन संख्या :- {data.competencyApplicationNumber || '..............................'}</span>
        </div>

        <table className="w-full border-collapse">
          <tbody className="uppercase">
            <DataRow number="1." label="शिक्षक का नाम" value={data.teacherName} />
            <DataRow number="2." label="विद्यालय का नाम" value={data.schoolName} />
            <DataRow number="3." label="विद्यालय का यू-डायस कोड" value={data.udiseCode} />
            <DataRow number="4." label="वर्ग" value={data.className} />
            <DataRow number="5." label="विषय" value={data.subject} />
            <DataRow number="6." label="नियुक्ति की कोटि (UR/BC/EBC/SC/EWS)" value={data.appointmentCategory} />
            <DataRow number="7." label="जन्म तिथि" value={formatDate(data.dateOfBirth)} />
            <DataRow number="8." label="विशिष्ट शिक्षक के रूप में योगदान तिथि" value={formatDate(data.dateOfJoiningAsSpecificTeacher)} />
            <DataRow number="9." label="प्रशिक्षण तिथि" value={formatDate(data.dateOfTraining)} />
            <DataRow number="10." label="दक्षता/BTET/CTET/STET का प्रकार" value={data.efficiencyType} />
            <DataRow number="11." label="दक्षता/BTET/CTET/STET उतीर्णता तिथि" value={formatDate(data.dateOfPassingEfficiency)} />
            <DataRow number="12." label="बैंक का नाम" value={data.bankDetails} />
            <DataRow number="13." label="बैंक खाता संख्या" value={data.bankAccountNumber} />
            <DataRow number="14." label="IFSC कोड" value={data.ifscCode} />
            <DataRow 
              number="15." 
              label="स्थानीय निकाय शिक्षक के रूप में प्रथम योगदान की तिथि" 
              value={formatDate(data.dateOfFirstJoiningAsLocalBodyTeacher)} 
              subLabel="(शिक्षा मित्र के रूप में जो 01/07/2006 के पूर्व नियोजित है वे पूर्व नियोजित हैं वे योगदान की तिथि 01.07.2006 अंकित करेंगे।)"
            />
            <DataRow number="16." label="प्रशिक्षित वेतनमान प्राप्त करने की तिथि" value={formatDate(data.dateOfReceivingTrainedPayScale)} />
            <DataRow number="17." label="क्या स्थानीय निकाय शिक्षक के रूप में योगदान तिथि से अद्यावधि तक कोई सेवा में टूट हैं (हाँ / नहीं)?" value={data.serviceBreak || ''} />
            <DataRow number="18." label="स्थानीय निकाय शिक्षक के रूप में माह दिसम्बर 2024 में प्राप्त मूल वेतन" value={data.december2024Salary} />
            <DataRow number="19." label="विशिष्ट शिक्षक के रूप में योगदान की तिथि को स्थानीय निकाय शिक्षक के रूप में अनुमान्य वेतन वृद्धि के साथ प्राप्त होने वाला मूल वेतन" value={data.newSalaryWithIncrement} />
            <DataRow number="20." label="विशिष्ट शिक्षक के रूप में पे-मैट्रिक के अनुरूप में मूल वेतन" value={data.payMatrixSalary} />
            <DataRow number="21." label="अगली वेतन वृद्धि तिथि" value={formatDate(data.nextIncrementDate)} />
          </tbody>
        </table>

        <footer className="mt-20 text-[13px]">
            <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                    <p className="mt-8">......................................</p>
                    <p className="pt-1">शिक्षक का हस्ताक्षर</p>
                </div>
                 <div>
                    <p className="mt-8">......................................</p>
                    <p className="pt-1">प्रधानाध्यापक का <br/> हस्ताक्षर एवं मुहर</p>
                </div>
                <div>
                    <p className="mt-8">......................................</p>
                    <p className="pt-1">प्रधानाध्यापक</p>
                    <p>चिन्हित मध्य</p>
                    <p>विद्यालय का</p>
                    <p>हस्ताक्षर एवं मुहर</p>
                </div>
                 <div>
                    <p className="mt-8">......................................</p>
                    <p className="pt-1">प्रखण्ड शिक्षा पदाधिकारी <br/> साहेबगंज मुजफ्फरपुर।</p>
                </div>
                 <div className="col-start-4">
                    <p className="mt-8">......................................</p>
                    <p className="pt-1">जिला कार्यक्रम पदाधिकारी <br/> स्थापना, मुजफ्फरपुर।</p>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
});

PrintPreview.displayName = 'PrintPreview';

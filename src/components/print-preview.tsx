'use client';

import type { FormValues } from '@/lib/schema';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';

type PrintPreviewProps = {
  data: FormValues;
};

const DataRow = ({ label, value, number }: { label: string; value?: string | Date | number; number?: string }) => {
  if (!value) return null;
  
  let displayValue: string;
  if (value instanceof Date) {
    displayValue = format(value, 'dd-MM-yyyy', { locale: hi });
  } else {
    displayValue = String(value);
  }

  return (
    <tr className="border-b">
      <td className="w-10 py-2 pr-2">{number}</td>
      <td className="w-1/2 py-2 pr-4 font-medium">{label}</td>
      <td className="w-10 py-2 text-center">:</td>
      <td className="w-1/2 py-2">{displayValue || '-'}</td>
    </tr>
  );
};

export function PrintPreview({ data }: PrintPreviewProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    try {
      return format(date, 'dd.MM.yyyy');
    } catch (error) {
      return '-';
    }
  }

  return (
    <div id="print-area" className="p-8 bg-white text-black font-body text-sm">
      <header className="text-center mb-6">
        <h1 className="text-lg font-bold">कार्यालय, जिला शिक्षा पदाधिकारी, मुजफ्फरपुर |</h1>
        <h2 className="text-md font-bold">(स्थापना-शाखा)</h2>
        <p className="text-xs mt-2 max-w-xl mx-auto">
        निदेशक (मा.शि.), शिक्षा विभाग, बिहार सरकार, पटना के पत्रांक-2999, दिनांक 14.10.2025 एवं जिला कार्यक्रम पदाधिकारी, स्थापना, मुजफ्फरपुर के पत्रांक 5876, मुजफ्फरपुर दिनांक 15.02.2025 के आलोक में
        </p>
        <h3 className="text-md font-bold mt-2 underline">विशिष्ट शिक्षकों का वेतन निर्धारण प्रपत्र</h3>
      </header>

      <div className="flex justify-between mb-4">
        <span>PRAN NO.:- {data.pran || '-'}</span>
        <span>सक्षमता आवेदन संख्या :- {data.competencyApplicationNumber || '-'}</span>
      </div>

      <main>
        <table className="w-full">
          <tbody>
            <DataRow number="1." label="शिक्षक का नाम" value={data.teacherName} />
            <DataRow number="2." label="विद्यालय का नाम" value={data.schoolName} />
            <DataRow number="3." label="विद्यालय का यू-डायस कोड" value={data.udiseCode} />
            <DataRow number="4." label="वर्ग" value={data.className} />
            <DataRow number="5." label="विषय" value={data.subject} />
            <DataRow number="6." label="नियुक्ति की कोटि (UR/BC/EBC/SC/EWS)" value={data.appointmentCategory} />
            <DataRow number="7." label="जन्म तिथि" value={data.dateOfBirth} />
            <DataRow number="8." label="विशिष्ट शिक्षक के रूप में योगदान तिथि" value={data.dateOfJoiningAsSpecificTeacher} />
            <DataRow number="9." label="प्रशिक्षण तिथि" value={data.dateOfTraining} />
            <DataRow number="10." label="दक्षता/BTET/CTET/STET का प्रकार" value={data.efficiencyType} />
            <DataRow number="11." label="दक्षता/BTET/CTET/STET उतीर्णता तिथि" value={data.dateOfTraining ? format(data.dateOfTraining, 'dd-MM-yyyy', { locale: hi }) : '-'} />
            <DataRow number="12." label="बैंक का नाम" value={data.bankDetails} />
            <DataRow number="13." label="बैंक खाता संख्या" value={data.bankAccountNumber} />
            <DataRow number="14." label="IFSC कोड" value={data.ifscCode} />
            <DataRow number="15." label="स्थानीय निकाय शिक्षक के रूप में प्रथम योगदान की तिथि" value={data.dateOfFirstJoiningAsLocalBodyTeacher} />
            <tr>
              <td colSpan={4} className="text-xs pl-10 pb-2">
              (शिक्षा मित्र के रूप में जो 01/07/2006 के पूर्व नियोजित है वे पूर्व नियोजित हैं वे योगदान की तिथि 01.07.2006 अंकित करेंगे)
              </td>
            </tr>
            <DataRow number="16." label="प्रशिक्षित वेतनमान प्राप्त करने की तिथि" value={data.dateOfReceivingTrainedPayScale} />
            <DataRow number="17." label="क्या स्थानीय निकाय शिक्षक के रूप में योगदान तिथि से अद्यावधि तक कोई सेवा में टूट हैं (हाँ / नहीं)?" value={data.serviceBreak} />
            <DataRow number="18." label="स्थानीय निकाय शिक्षक के रूप में माह दिसम्बर 2024 में प्राप्त मूल वेतन" value={data.december2024Salary} />
            <DataRow number="19." label="विशिष्ट शिक्षक के रूप में योगदान की तिथि को स्थानीय निकाय शिक्षक के रूप में अनुमान्य वेतन वृद्धि के साथ प्राप्त होने वाला मूल वेतन" value={data.newSalaryWithIncrement} />
            <DataRow number="20." label="विशिष्ट शिक्षक के रूप में पे-मैट्रिक के अनुरूप में मूल वेतन" value={data.payMatrixSalary} />
            <DataRow number="21." label="अगली वेतन वृद्धि तिथि" value={data.nextIncrementDate} />
          </tbody>
        </table>

        <footer className="mt-16 text-xs">
            <div className="flex justify-between items-end text-center">
                <div className="mt-8">
                    <p className="border-t border-black pt-1">शिक्षक का हस्ताक्षर</p>
                </div>
                 <div className="mt-8">
                    <p className="border-t border-black pt-1">प्रधानाध्यापक का <br/> हस्ताक्षर एवं मुहर</p>
                </div>
                <div className="mt-8">
                    <p className="border-t border-black pt-1">प्रधानाध्यापक <br/> चिन्हित मध्य <br/> विद्यालय का <br/> हस्ताक्षर एवं मुहर</p>
                </div>
                 <div className="mt-8">
                    <p className="border-t border-black pt-1">प्रखण्ड शिक्षा पदाधिकारी <br/> साहेबगंज मुजफ्फरपुर।</p>
                </div>
                 <div className="mt-8">
                    <p className="border-t border-black pt-1">जिला कार्यक्रम पदाधिकारी <br/> स्थापना, मुजफ्फरपुर।</p>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}

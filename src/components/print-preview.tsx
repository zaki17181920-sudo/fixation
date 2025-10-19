'use client';

import type { FormValues } from '@/lib/schema';
import { format } from 'date-fns';

type PrintPreviewProps = {
  data: FormValues;
};

const DataRow = ({ label, value, number }: { label: string; value?: string | Date | number; number?: string }) => {
  let displayValue: string;
  if (value instanceof Date) {
    try {
      displayValue = format(value, 'yyyy-MM-dd');
    } catch (e) {
      displayValue = '-';
    }
  } else {
    displayValue = value ? String(value) : '-';
  }

  return (
    <tr className="border-b border-black">
      <td className="py-1 pr-2 w-8 align-top">{number}</td>
      <td className="w-2/5 py-1 pr-2 font-medium align-top">{label}</td>
      <td className="w-4 py-1 text-center align-top">:</td>
      <td className="w-auto py-1">{displayValue}</td>
    </tr>
  );
};

export function PrintPreview({ data }: PrintPreviewProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    try {
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      return '-';
    }
  }
  
  const salaryText = `Level ${data.levelForDecember2024Salary || '..........'} Index ${data.indexForDecember2024Salary || '..........'} में प्राप्त मूल वेतन ${data.december2024Salary || ''}`;
  const newSalaryText = `Level-${data.levelForNewSalary || '2/3/5/6'}, Index ${data.indexForNewSalary || '............'} मूल वेतन ${data.newSalaryWithIncrement || ''}`;


  return (
    <div id="print-area" className="p-6 bg-white text-black font-body text-[10px]">
      <header className="text-center mb-4">
        <h1 className="text-sm font-bold">कार्यालय, जिला शिक्षा पदाधिकारी, पूर्वी चम्पारण, मोतिहारी</h1>
        <h2 className="text-sm font-bold">(स्थापना शाखा)</h2>
        <p className="text-[9px] mt-1 max-w-xl mx-auto">
        (निदेशक (प्रा०शि०), शिक्षा विभाग, बिहार सरकार के पत्रांक-281 दिनांक 23.01.2025 के आलोक में)
        </p>
      </header>
      
      <main>
        <table className="w-full border-collapse">
          <tbody>
            <DataRow number="1." label="विशिष्ट शिक्षक का नाम" value={data.teacherName} />
            <DataRow number="2." label="PRAN संख्या" value={data.pran} />
            <DataRow number="3." label="वर्ग" value={data.className} />
            <DataRow number="4." label="विषय" value={data.subject} />
            <DataRow number="5." label="नियुक्ति की कोटि(UR/BC/EBC/SC/ST/EWS)" value={data.appointmentCategory} />
            <DataRow number="6." label="विद्यालय का नाम" value={data.schoolName} />
            <DataRow number="7." label="विद्यालय का U-DISE CODE" value={data.udiseCode} />
            <DataRow number="8." label="प्रखंड" value={data.block} />
            <DataRow number="9." label="विशिष्ट शिक्षक का आई०डी०सं०" value={data.competencyApplicationNumber} />
            <DataRow number="10." label="जन्म तिथि" value={data.dateOfBirth ? formatDate(data.dateOfBirth) : '-'} />
            <DataRow number="11." label="विशिष्ट शिक्षक के रूप में योगदान तिथि" value={data.dateOfJoiningAsSpecificTeacher ? formatDate(data.dateOfJoiningAsSpecificTeacher) : '-'} />
            <DataRow number="12." label="प्रशिक्षण तिथि" value={data.dateOfTraining ? formatDate(data.dateOfTraining) : '-'} />
            <DataRow number="13." label="दक्षता/BTET/CTET का प्रकार" value={data.efficiencyType} />
            <DataRow number="14." label="दक्षता/BTET/CTET उत्तीर्णता तिथि" value={data.dateOfReceivingTrainedPayScale ? formatDate(data.dateOfReceivingTrainedPayScale) : '-'} />
            <DataRow number="15." label="बैंक खाता संख्या" value={data.bankAccountNumber} />
            <DataRow number="16." label="IFSC कोड" value={data.ifscCode} />
            <DataRow number="17." label="स्थानीय निकाय शिक्षक के रूप में प्रथम योगदान तिथि" value={data.dateOfFirstJoiningAsLocalBodyTeacher ? formatDate(data.dateOfFirstJoiningAsLocalBodyTeacher) : '-'} />
            <tr>
              <td colSpan={4} className="text-[8px] pl-8 pb-1">
              (शिक्षा मित्र के रूप में जो दिनांक 01.07.2006 के पूर्व नियोजित हैं, वे योगदान की तिथि 01.07.2006 अंकित करेंगे।)
              </td>
            </tr>
            <DataRow number="18." label="प्रशिक्षित वेतनमान प्राप्त करने की तिथि" value={data.dateOfReceivingTrainedPayScale ? formatDate(data.dateOfReceivingTrainedPayScale) : '-'} />
            <DataRow number="19." label="क्या स्थानीय निकाय शिक्षक के रूप में योगदान तिथि से अध्यावधि तक कोई सेवा में टूट है (हाँ/नही)?" value={data.serviceBreak} />
            <DataRow number="20." label="स्थानीय निकाय शिक्षक के रूप में विशिष्ट शिक्षक के योगदान तिथि को" value={salaryText} />
            <DataRow number="21." label="विशिष्ट शिक्षक नियमावली 2023 (यथा संशोधित) के फिटमेंट मैट्रिक्स 'अनुलग्नक-क' के अनुसार योगदान तिथि को निर्धारित" value={newSalaryText} />
            <DataRow number="22." label="अगली वेतन वृद्धि तिथि" value={data.nextIncrementDate ? formatDate(data.nextIncrementDate) : '-'} />
          </tbody>
        </table>
        
        <p className="mt-2 text-[9px]">
            नोट :- स्थानीय निकाय शिक्षक के रूप में निर्धारित वेतन प्रपत्र, प्रशिक्षण प्रमाण पत्र, दक्षता/BTET/CTET प्रमाण पत्र एवं विशिष्ट शिक्षक का योगदान पत्र (स्व-अभिप्रमाणित छाया प्रति) संलग्न करें।
        </p>

        <footer className="mt-6 text-[10px]">
            <div className="flex justify-between items-end text-center">
                <div className="mt-4">
                    <p className="border-t border-black pt-1">शिक्षक का हस्ताक्षर</p>
                </div>
                 <div className="mt-4">
                    <p className="border-t border-black pt-1">प्रधानाध्यापक का <br/> हस्ताक्षर</p>
                </div>
                <div className="mt-4">
                    <p className="border-t border-black pt-1">प्रखंड शिक्षा पदाधिकारी <br/> का हस्ताक्षर</p>
                </div>
                 <div className="mt-4">
                    <p className="border-t border-black pt-1">जिला कार्यक्रम पदाधिकारी <br/> स्थापना, पूर्वी चम्पारण, मोतिहारी</p>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}

// This is a sample data file.
// You can add more UDISE codes and school names here.

export type SchoolInfo = {
    name: string;
    block: string;
};

export const schoolData: Record<string, SchoolInfo> = {
  '10010100101': { name: 'राजकीय मध्य विद्यालय, मोतिहारी', block: 'मोतिहारी' },
  '10010100102': { name: 'राजकीय कन्या मध्य विद्यालय, मोतिहारी', block: 'मोतिहारी' },
  '10020300405': { name: 'उत्क्रमित मध्य विद्यालय, पताही', block: 'पताही' },
};

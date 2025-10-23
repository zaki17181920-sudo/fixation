import { FileText } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/20 p-2 rounded-lg">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-2xl font-bold font-headline text-foreground">
        Fixation Slip Muzaffarpur
      </h1>
    </div>
  );
}

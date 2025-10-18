'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';

type SalaryFormProps = {
  form: UseFormReturn<FormValues>;
};

export function SalaryForm({ form }: SalaryFormProps) {
  return (
    <Form {...form}>
      <form className="space-y-6">
        <Accordion type="multiple" defaultValue={['item-0', 'item-1', 'item-2', 'item-3', 'item-4']} className="w-full">
          <AccordionItem value="item-0">
            <AccordionTrigger>
              <h3 className="font-headline text-lg">PRAN/आवेदन संख्या</h3>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PRAN NO.</FormLabel>
                        <FormControl>
                          <Input placeholder="PRAN NO." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="competencyApplicationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>सक्षमता आवेदन संख्या</FormLabel>
                        <FormControl>
                          <Input placeholder="सक्षमता आवेदन संख्या" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h3 className="font-headline text-lg">1. कार्यालय विवरण</h3>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="office"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>कार्यालय</FormLabel>
                        <FormControl>
                          <Input placeholder="कार्यालय का नाम" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="districtEducationOfficer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>जिला शिक्षा पदाधिकारी</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>जिला</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h3 className="font-headline text-lg">2. शिक्षक सूचना</h3>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="border-0 shadow-none">
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="teacherName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>शिक्षक का नाम</FormLabel>
                        <FormControl>
                          <Input placeholder="पूरा नाम" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>विद्यालय का नाम</FormLabel>
                        <FormControl>
                          <Input placeholder="विद्यालय का पूरा नाम" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="udiseCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>विद्यालय का यू-डायस कोड</FormLabel>
                        <FormControl>
                          <Input placeholder="U-DISE कोड" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>वर्ग</FormLabel>
                        <FormControl>
                          <Input placeholder="जैसे 1-5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>विषय</FormLabel>
                        <FormControl>
                          <Input placeholder="जैसे सामान्य" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="appointmentCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>नियुक्ति की कोटि (UR/BC/EBC/SC/EWS)</FormLabel>
                        <FormControl>
                          <Input placeholder="नियुक्ति कोटि" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>जन्म तिथि</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>एक तारीख चुनें</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown-buttons"
                              fromYear={1930}
                              toYear={new Date().getFullYear()}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1930-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="dateOfJoiningAsSpecificTeacher"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>विशिष्ट शिक्षक के रूप में योगदान तिथि</FormLabel>
                         <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>एक तारीख चुनें</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown-buttons"
                              fromYear={1980}
                              toYear={new Date().getFullYear()}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="dateOfTraining"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>प्रशिक्षण तिथि</FormLabel>
                         <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>एक तारीख चुनें</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown-buttons"
                              fromYear={1980}
                              toYear={new Date().getFullYear()}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              <h3 className="font-headline text-lg">3. वेतन और बैंक विवरण</h3>
            </AccordionTrigger>
            <AccordionContent>
               <Card className="border-0 shadow-none">
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                   <FormField
                    control={form.control}
                    name="efficiencyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>दक्षता/BTET/CTET/STET का प्रकार</FormLabel>
                        <FormControl>
                          <Input placeholder="दक्षता / पात्रता" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="bankDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>बैंक का नाम</FormLabel>
                        <FormControl>
                          <Input placeholder="बैंक का नाम" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>बैंक खाता संख्या</FormLabel>
                        <FormControl>
                          <Input placeholder="बैंक खाता संख्या" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC कोड</FormLabel>
                        <FormControl>
                          <Input placeholder="IFSC कोड" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <h3 className="font-headline text-lg">4. अन्य विवरण</h3>
            </AccordionTrigger>
            <AccordionContent>
               <Card className="border-0 shadow-none">
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfFirstJoiningAsLocalBodyTeacher"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:col-span-2">
                        <FormLabel>स्थानीय निकाय शिक्षक के रूप में प्रथम योगदान की तिथि</FormLabel>
                         <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>एक तारीख चुनें</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown-buttons"
                              fromYear={1980}
                              toYear={new Date().getFullYear()}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfReceivingTrainedPayScale"
                    render={({ field }) => (
                      <FormItem className="flex flex-col md:col-span-2">
                        <FormLabel>प्रशिक्षित वेतनमान प्राप्त करने की तिथि</FormLabel>
                         <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>एक तारीख चुनें</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown-buttons"
                              fromYear={1980}
                              toYear={new Date().getFullYear()}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceBreak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>क्या स्थानीय निकाय शिक्षक के रूप में योगदान तिथि से अद्यावधि तक कोई सेवा में टूट हैं (हाँ / नहीं)?</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="december2024Salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>स्थानीय निकाय शिक्षक के रूप में माह दिसम्बर 2024 में प्राप्त मूल वेतन</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="newSalaryWithIncrement"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>विशिष्ट शिक्षक के रूप में योगदान की तिथि को स्थानीय निकाय शिक्षक के रूप में अनुमान्य वेतन वृद्धि के साथ प्राप्त होने वाला मूल वेतन</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="payMatrixSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>विशिष्ट शिक्षक के रूप में पे-मैट्रिक के अनुरूप में मूल वेतन</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nextIncrementDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>अगली वेतन वृद्धि तिथि</FormLabel>
                         <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "yyyy-MM-dd")
                                ) : (
                                  <span>एक तारीख चुनें</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout="dropdown-buttons"
                              fromYear={1980}
                              toYear={new Date().getFullYear()}
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}

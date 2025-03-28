import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { claimFormSchema } from "@shared/schema";
import { CheckCircle, Calendar as CalendarIcon, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import SettingsModal from "@/components/layout/settings-modal";
import { motion } from "framer-motion";

const formTabs = {
  personalDetails: "personalDetails",
  billDetails: "billDetails",
};

export default function FormPage() {
  const [activeTab, setActiveTab] = useState(formTabs.personalDetails);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof claimFormSchema>>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      category: undefined,
      description: "",
      amount: undefined,
      billNumber: "",
      billDate: "",
      hospitalName: "",
      doctorName: "",
      patientName: "",
      relationship: "",
    },
  });

  const submitClaimMutation = useMutation({
    mutationFn: async (values: z.infer<typeof claimFormSchema>) => {
      const res = await apiRequest("POST", "/api/claims", values);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setIsSubmitSuccess(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error submitting claim",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof claimFormSchema>) => {
    submitClaimMutation.mutate(values);
  };

  const handleNextTab = () => {
    if (activeTab === formTabs.personalDetails) {
      // Validate personal fields before switching tabs
      const personalFieldsValid = form.trigger([
        "category",
        "patientName",
        "relationship",
      ]);
      personalFieldsValid.then((valid) => {
        if (valid) setActiveTab(formTabs.billDetails);
      });
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === formTabs.billDetails) {
      setActiveTab(formTabs.personalDetails);
    }
  };

  if (isSubmitSuccess) {
    return (
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold">Submit Claim</h1>
                <p className="mt-1 text-sm text-muted-foreground">Fill out the details for your new medical claim</p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <Card className="border-border bg-card">
                  <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Claim Submitted Successfully</h2>
                    <p className="text-muted-foreground mb-6">
                      Your claim has been submitted and is now pending approval. You can track the status in the Claims section.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button asChild>
                        <a href="/claims">View My Claims</a>
                      </Button>
                      <Button variant="outline" onClick={() => setIsSubmitSuccess(false)}>
                        Submit Another Claim
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
        
        <MobileMenu onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Submit Claim</h1>
              <p className="mt-1 text-sm text-muted-foreground">Fill out the details for your new medical claim</p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Medical Claim Form</CardTitle>
                  <CardDescription>
                    Please provide accurate information to expedite the approval process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value={formTabs.personalDetails}>Personal Details</TabsTrigger>
                          <TabsTrigger value={formTabs.billDetails}>Bill Details</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value={formTabs.personalDetails} className="space-y-6 pt-4">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Claim Category</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select claim category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="domiciliary">Domiciliary</SelectItem>
                                      <SelectItem value="chronic">Chronic</SelectItem>
                                      <SelectItem value="hospitalization">Hospitalization</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    Select the appropriate category for your medical expense
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="patientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Patient Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Full name of the patient" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="relationship"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Relationship with Primary Member</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select relationship" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="self">Self</SelectItem>
                                      <SelectItem value="spouse">Spouse</SelectItem>
                                      <SelectItem value="child">Child</SelectItem>
                                      <SelectItem value="parent">Parent</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end pt-4">
                              <Button type="button" onClick={handleNextTab}>
                                Next
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value={formTabs.billDetails} className="space-y-6 pt-4">
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe the medical expense" 
                                      className="min-h-[100px]" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Amount (₹)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number"
                                        placeholder="Enter amount in rupees"
                                        {...field}
                                        onChange={e => field.onChange(parseFloat(e.target.value))}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="billNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bill Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter bill number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="billDate"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Bill Date</FormLabel>
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
                                              format(new Date(field.value), "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value ? new Date(field.value) : undefined}
                                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                          disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
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
                                name="doctorName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Doctor's Name</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">₹</span>
                                        <Input 
                                          placeholder="Doctor's name" 
                                          className="pl-7" 
                                          {...field} 
                                          value={field.value ? field.value.replace(/^₹/, '') : ''}
                                          onChange={(e) => {
                                            // Remove any existing Rupee symbols to prevent duplication
                                            const value = e.target.value.replace(/^₹/, '');
                                            field.onChange(value);
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="hospitalName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Hospital/Pharmacy Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Name of the hospital or pharmacy" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-between pt-4">
                              <Button type="button" variant="outline" onClick={handlePreviousTab}>
                                Previous
                              </Button>
                              <Button 
                                type="submit" 
                                disabled={submitClaimMutation.isPending}
                              >
                                {submitClaimMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting
                                  </>
                                ) : (
                                  <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Submit Claim
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 border-t pt-6">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Important Notes:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>All claims must be submitted with original bills and prescriptions</li>
                      <li>Claims should be submitted within 90 days of incurring the expense</li>
                      <li>For chronic conditions, a certificate from a medical officer is required</li>
                    </ul>
                  </div>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    By submitting this form, you certify that all information is accurate and truthful to the best of your knowledge.
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <MobileMenu onOpenSettings={() => setIsSettingsOpen(true)} />
    </div>
  );
}

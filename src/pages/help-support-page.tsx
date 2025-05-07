import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import SettingsModal from "@/components/layout/settings-modal";
import { motion } from "framer-motion";

// Form validation schema
const supportFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export default function HelpSupportPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("faqs");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supportFormSchema>>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof supportFormSchema>) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
      form.reset();
      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1500);
  };

  const faqs = [
    {
      question: "How do I submit a claim?",
      answer: "To submit a claim, navigate to the 'Submit Claim' section from the sidebar or main dashboard. Fill out the required information including claim category, amount, and supporting details. Upload any relevant documents as attachments. Once submitted, your claim will be reviewed by the medical authorities."
    },
    {
      question: "What documents are required for claim submission?",
      answer: "For claim submission, you typically need original medical bills, prescriptions, doctor's advice/consultation notes, lab test reports (if applicable), and hospital discharge summary for hospitalization claims. All documents should be clearly legible and contain the patient's name, date of service, and amount paid."
    },
    {
      question: "How long does it take to process a claim?",
      answer: "Standard claims are typically processed within 7-10 working days from the date of submission. Complex or hospitalization claims may take up to 15 working days. You can track the status of your claim in the 'My Claims' section of the portal."
    },
    {
      question: "What is the difference between domiciliary, chronic, and hospitalization claims?",
      answer: "Domiciliary claims cover regular outpatient expenses like doctor consultations and medications. Chronic claims are for long-term medication for ongoing conditions like diabetes or hypertension. Hospitalization claims cover in-patient treatment, surgeries, and emergency room services."
    },
    {
      question: "I've submitted a claim but it's showing as rejected. What should I do?",
      answer: "If your claim is rejected, check the rejection reason in the claim details. Common reasons include incomplete documentation, exceeding entitlement limits, or ineligible expenses. You can resubmit the claim with additional information or contact the support team for assistance."
    },
    {
      question: "How can I check my remaining entitlement balance?",
      answer: "Your entitlement balance is displayed on the main dashboard under 'Available Balance'. For a detailed breakdown by category, visit the 'Entitlements' section, which shows used and remaining amounts for each entitlement category."
    },
    {
      question: "Can I submit claims for my family members?",
      answer: "Yes, you can submit claims for your dependents including spouse, children, and dependent parents. When submitting the claim, specify the relationship in the 'Patient Details' section and provide the dependent's information."
    },
    {
      question: "What happens if I exceed my entitlement limit?",
      answer: "If you exceed your entitlement limit for a particular category, any additional claims in that category will not be eligible for reimbursement for the current financial year. Entitlements are reset at the beginning of each financial year on April 1st."
    }
  ];

  const userGuideSteps = [
    {
      title: "Getting Started",
      content: "Log in to your account using your credentials. Upon successful login, you'll be directed to the dashboard where you can view your entitlements, pending claims, and upcoming appointments."
    },
    {
      title: "Viewing Your Entitlements",
      content: "Navigate to the 'Entitlements' section to see your available medical benefits across different categories. This section displays your used and remaining amounts for each category and provides detailed information about coverage."
    },
    {
      title: "Submitting a New Claim",
      content: "Click on 'Submit Claim' in the sidebar. Fill out the form with accurate information about your medical expense. Ensure all required fields are completed. The form is divided into two sections: Personal Details and Bill Details. Submit the form once all information is entered."
    },
    {
      title: "Tracking Your Claims",
      content: "Go to 'My Claims' to view all your submitted claims. You can filter claims by status (pending, approved, rejected) and track their progress. Detailed information about each claim is available by clicking on the claim item."
    },
    {
      title: "Checking Dashboard Statistics",
      content: "The dashboard provides an overview of your medical benefits, including available balance, pending claims, and upcoming appointments. It also features a chart showing your claims by category and a summary of your entitlement usage."
    },
    {
      title: "Updating Your Profile",
      content: "Access your profile settings by clicking on your name or profile picture. Update your personal information, contact details, and notification preferences as needed."
    },
    {
      title: "Getting Help",
      content: "If you encounter any issues or have questions, visit the 'Help & Support' section. Here you can find frequently asked questions, user guides, and a contact form to reach out to the support team."
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Help & Support</h1>
              <p className="mt-1 text-sm text-muted-foreground">Find answers to common questions and get support</p>
            </div>
            
            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                  <TabsTrigger value="userGuide">User Guide</TabsTrigger>
                  <TabsTrigger value="contact">Contact Support</TabsTrigger>
                </TabsList>
                
                <TabsContent value="faqs" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                          Frequently Asked Questions
                        </CardTitle>
                        <CardDescription>
                          Find answers to the most common questions about the CISF Medical System
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {faqs.map((faq, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <AccordionItem value={`faq-${index}`}>
                                <AccordionTrigger className="text-left">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-muted-foreground">{faq.answer}</p>
                                </AccordionContent>
                              </AccordionItem>
                            </motion.div>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="userGuide" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          User Guide
                        </CardTitle>
                        <CardDescription>
                          Step-by-step instructions for using the CISF Medical System
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-8">
                          {userGuideSteps.map((step, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="relative pl-10"
                            >
                              <div className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                                {index + 1}
                              </div>
                              <h3 className="text-base font-medium">{step.title}</h3>
                              <p className="mt-2 text-sm text-muted-foreground">{step.content}</p>
                              {index < userGuideSteps.length - 1 && (
                                <div className="absolute top-7 bottom-0 left-3.5 w-px bg-border" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-8 p-4 bg-secondary/30 rounded-lg">
                          <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium mb-1">Need Additional Help?</h4>
                              <p className="text-sm text-muted-foreground">
                                If you can't find the information you need in this guide, please contact our support team using the Contact Support tab.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="contact" className="mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Mail className="h-5 w-5 mr-2 text-primary" />
                              Contact Support
                            </CardTitle>
                            <CardDescription>
                              Fill out the form below to reach our support team
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {isSubmitSuccess ? (
                              <div className="py-6 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                  <CheckCircle className="h-6 w-6 text-green-500" />
                                </div>
                                <h3 className="text-xl font-medium mb-2">Request Submitted</h3>
                                <p className="text-muted-foreground mb-4">
                                  Thank you for contacting us. Our support team will get back to you soon.
                                </p>
                                <Button onClick={() => setIsSubmitSuccess(false)}>
                                  Submit Another Request
                                </Button>
                              </div>
                            ) : (
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="name"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Name</FormLabel>
                                          <FormControl>
                                            <Input placeholder="Your full name" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name="email"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Email</FormLabel>
                                          <FormControl>
                                            <Input type="email" placeholder="Your email address" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Brief description of your issue" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Detailed description of your issue or question" 
                                            className="min-h-[120px]" 
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          Please provide as much detail as possible to help us assist you better.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={isSubmitting}
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                      </>
                                    ) : (
                                      "Submit Request"
                                    )}
                                  </Button>
                                </form>
                              </Form>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <Card>
                          <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                              Alternative ways to reach us
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="flex items-start">
                              <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
                              <div>
                                <h3 className="text-sm font-medium">Support Helpline</h3>
                                <p className="text-sm text-muted-foreground">+91 11 2222 3333</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Available Monday to Friday, 9:00 AM to 6:00 PM
                                </p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-start">
                              <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
                              <div>
                                <h3 className="text-sm font-medium">Email Support</h3>
                                <p className="text-sm text-muted-foreground">medical-support@cisf.gov.in</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  We respond within 24-48 hours
                                </p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                              <div>
                                <h3 className="text-sm font-medium">Medical Cell Address</h3>
                                <p className="text-sm text-muted-foreground">
                                  CISF Medical Cell, Block 10<br />
                                  CGO Complex, Lodhi Road<br />
                                  New Delhi - 110003
                                </p>
                              </div>
                            </div>
                            
                            <div className="pt-4 pb-2">
                              <h3 className="text-sm font-medium mb-2">Emergency Contact</h3>
                              <div className="p-3 bg-red-900/20 rounded-lg">
                                <p className="text-sm font-medium text-red-400 mb-1">
                                  Medical Emergency: +91 11 2222 4444
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Available 24/7 for urgent medical assistance
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <MobileMenu onOpenSettings={() => setIsSettingsOpen(true)} />
    </div>
  );
}

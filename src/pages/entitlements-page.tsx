import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { InfoIcon, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import SettingsModal from "@/components/layout/settings-modal";
import { motion } from "framer-motion";

export default function EntitlementsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { data: entitlements, isLoading } = useQuery({
    queryKey: ["/api/entitlements"],
  });
  
  const getEntitlementData = (category: string) => {
    if (!entitlements) return null;
    return entitlements.find((ent: any) => ent.category === category);
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "domiciliary":
        return "bg-[hsl(var(--chart-1))]";
      case "chronic":
        return "bg-[hsl(var(--chart-2))]";
      case "hospitalization":
        return "bg-[hsl(var(--chart-5))]";
      default:
        return "bg-primary";
    }
  };
  
  const entitlementCategories = [
    {
      id: "domiciliary",
      title: "Domiciliary",
      description: "Regular outpatient expenses and medications",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 9H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Z"></path>
          <path d="M12 15v6"></path>
          <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"></path>
        </svg>
      ),
      iconBgClass: "bg-blue-900/20",
      iconTextClass: "text-blue-400",
      coverageItems: [
        "Outpatient consultations with registered medical practitioners",
        "Prescribed medications and supplies",
        "Diagnostic tests and laboratory services",
        "Preventive health check-ups",
        "Dental and vision care"
      ],
      policyNotes: "Claims under this category must be submitted within 90 days of the expense date. Original bills and prescriptions are required."
    },
    {
      id: "chronic",
      title: "Chronic",
      description: "Long-term medication for chronic conditions",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 14 4-4"></path>
          <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
        </svg>
      ),
      iconBgClass: "bg-green-900/20",
      iconTextClass: "text-green-400",
      coverageItems: [
        "Regular medications for chronic conditions",
        "Specialist consultations for chronic disease management",
        "Medical devices for monitoring chronic conditions",
        "Rehabilitative therapy services",
        "Nutritional supplements as prescribed"
      ],
      policyNotes: "Chronic condition must be certified by a medical officer. Quarterly claim submission is recommended for continuous medications."
    },
    {
      id: "hospitalization",
      title: "Hospitalization",
      description: "Emergency and in-patient treatment",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
          <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
          <circle cx="12" cy="12" r="2"></circle>
          <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
          <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
        </svg>
      ),
      iconBgClass: "bg-purple-900/20",
      iconTextClass: "text-purple-400",
      coverageItems: [
        "In-patient treatment at hospitals",
        "Day care procedures",
        "Emergency room services",
        "Ambulance charges",
        "Pre and post hospitalization expenses",
        "Surgical procedures",
        "Intensive care unit charges"
      ],
      policyNotes: "Prior approval required for planned hospitalizations. For emergencies, notification must be given within 24 hours of admission."
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
              <h1 className="text-2xl font-semibold">Entitlements</h1>
              <p className="mt-1 text-sm text-muted-foreground">Understand and track your medical benefits</p>
            </div>
            
            <div className="mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Your total medical entitlements for the financial year 2023-24
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {isLoading ? (
                      Array(3).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse space-y-2">
                          <div className="h-5 bg-secondary rounded w-1/4"></div>
                          <div className="h-2 bg-secondary rounded"></div>
                          <div className="h-3 bg-secondary rounded w-1/2 mt-2"></div>
                        </div>
                      ))
                    ) : (
                      entitlementCategories.map((category, index) => {
                        const data = getEntitlementData(category.id);
                        if (!data) return null;
                        
                        const percentage = Math.round((data.usedAmount / data.totalAmount) * 100);
                        
                        return (
                          <motion.div 
                            key={category.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                <div className={cn("p-1.5 rounded-lg mr-3", category.iconBgClass)}>
                                  <div className={cn(category.iconTextClass)}>{category.icon}</div>
                                </div>
                                <span className="text-base font-medium">{category.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ₹{data.usedAmount.toLocaleString()} of ₹{data.totalAmount.toLocaleString()}
                              </span>
                            </div>
                            <Progress 
                              value={percentage} 
                              className="h-2" 
                              indicatorClassName={getCategoryColor(category.id)} 
                            />
                            <div className="mt-1 flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">{data.description}</span>
                              <span className="text-xs font-medium">
                                {percentage}% Used
                              </span>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entitlement Details</CardTitle>
                  <CardDescription>
                    Detailed information about each entitlement category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {entitlementCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                      >
                        <AccordionItem value={category.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center">
                              <div className={cn("p-1.5 rounded-lg mr-3", category.iconBgClass)}>
                                <div className={cn(category.iconTextClass)}>{category.icon}</div>
                              </div>
                              <div className="text-left">
                                <h3 className="text-base font-medium">{category.title}</h3>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-4 pb-2">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <InfoIcon className="h-4 w-4 mr-2 text-primary" />
                                Coverage Details
                              </h4>
                              <ul className="ml-6 space-y-1 list-disc text-sm text-muted-foreground">
                                {category.coverageItems.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                              
                              <div className="mt-4 bg-secondary/30 p-3 rounded-lg">
                                <h4 className="text-sm font-medium mb-1 flex items-center">
                                  <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                                  Policy Notes
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {category.policyNotes}
                                </p>
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <Button asChild size="sm" variant="outline">
                                  <a href="/submit-claim">Submit Claim in this Category</a>
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entitlement Policies</CardTitle>
                  <CardDescription>
                    Important information about your medical entitlements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="prose prose-sm max-w-none dark:prose-invert"
                  >
                    <p>
                      CISF officers are entitled to comprehensive medical benefits as per the Central Government Health Scheme (CGHS) guidelines. These benefits are designed to cover medical expenses for officers and their dependent family members.
                    </p>
                    
                    <h3>General Guidelines</h3>
                    <ul>
                      <li>The entitlement period is from April 1st to March 31st of each financial year.</li>
                      <li>Unused entitlements cannot be carried forward to the next financial year.</li>
                      <li>All claims must be submitted with original bills and prescriptions.</li>
                      <li>Claims should be submitted within 90 days of incurring the expense.</li>
                      <li>For chronic conditions, a certificate from a medical officer is required.</li>
                    </ul>
                    
                    <h3>Claim Process</h3>
                    <p>
                      Claims can be submitted online through this portal or in physical form at the CISF Medical Cell. The claim will go through a verification process before approval. You can track the status of your claim in the "My Claims" section.
                    </p>
                    
                    <div className="bg-secondary/30 p-4 rounded-lg mt-4">
                      <h3 className="text-base font-medium mb-2">Need Help?</h3>
                      <p className="mb-4">
                        If you have any questions about your entitlements or the claim process, please contact the CISF Medical Cell or visit the Help & Support section.
                      </p>
                      <Button asChild>
                        <a href="/help-support">Contact Support</a>
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <MobileMenu onOpenSettings={() => setIsSettingsOpen(true)} />
    </div>
  );
}

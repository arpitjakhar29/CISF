import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface EntitlementCategory {
  id: number;
  name: string;
  description: string;
  totalAmount: number;
  usedAmount: number;
  fiscalYear: string;
  category: "domiciliary" | "chronic" | "hospitalization";
}

interface ClaimSummaryProps {
  entitlements: EntitlementCategory[];
}

export default function ClaimSummary({ entitlements }: ClaimSummaryProps) {
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-border bg-card shadow-sm h-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-medium">Claim Summary</CardTitle>
          <p className="text-xs text-muted-foreground">Usage by entitlement category</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            {entitlements.map((entitlement) => {
              const percentage = Math.round((entitlement.usedAmount / entitlement.totalAmount) * 100);
              
              return (
                <motion.div 
                  key={entitlement.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * entitlement.id }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{entitlement.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ₹{entitlement.usedAmount.toLocaleString()} / ₹{entitlement.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2" 
                    indicatorClassName={getCategoryColor(entitlement.category)} 
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>{entitlement.description}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

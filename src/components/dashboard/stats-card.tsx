import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
  percentageChange?: number;
  progress?: {
    current: number;
    total: number;
  };
  children?: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  iconBgClass,
  iconTextClass,
  percentageChange,
  progress,
  children
}: StatsCardProps) {
  const formatCurrency = (value: string | number) => {
    if (typeof value === 'string' && value.startsWith('₹')) {
      return value;
    }
    return `₹${value}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
            <div className={cn("p-1.5 rounded-lg", iconBgClass)}>
              <div className={cn("h-5 w-5", iconTextClass)}>{icon}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-baseline">
              <p className="text-3xl font-semibold text-foreground">
                {value.toString().startsWith('₹') ? value : formatCurrency(value)}
              </p>
              {percentageChange !== undefined && (
                <span className={cn(
                  "ml-2 text-xs font-medium",
                  percentageChange >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {percentageChange >= 0 ? '+' : ''}{percentageChange}%
                </span>
              )}
            </div>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          
          {progress && (
            <div className="mt-4">
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div 
                  className="bg-primary h-1.5 rounded-full" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Used: ₹{progress.current.toLocaleString()}</span>
                <span>Total: ₹{progress.total.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItem {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-900/20 text-amber-400 hover:bg-amber-900/30";
      case "approved":
        return "bg-green-900/20 text-green-400 hover:bg-green-900/30";
      case "rejected":
        return "bg-red-900/20 text-red-400 hover:bg-red-900/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </div>
          <Link href="/claims">
            <Button variant="link" className="text-xs text-primary hover:text-primary/80">
              View All
            </Button>
          </Link>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activities.map((activity, index) => (
                  <motion.tr 
                    key={activity.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 * index }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(activity.date)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{activity.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">{activity.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">₹{activity.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="outline" className={cn("capitalize", getStatusBadge(activity.status))}>
                        {activity.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  subtitle: string;
  data: any[];
}

export default function ChartCard({ title, subtitle, data }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--card-foreground))" 
                  }}
                  formatter={(value) => [`₹${value}`, ""]}
                />
                <Bar dataKey="domiciliary" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="chronic" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="hospitalization" stackId="a" fill="hsl(var(--chart-5))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2"></div>
              <span className="text-sm">Domiciliary</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))] mr-2"></div>
              <span className="text-sm">Chronic</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-5))] mr-2"></div>
              <span className="text-sm">Hospitalization</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

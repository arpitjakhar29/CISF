import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendAnalysisChartProps {
  title: string;
  subtitle: string;
  data: any[];
  trendPercentage?: number;
  targetValue?: number;
}

const getCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip rounded-md border border-border bg-card shadow-sm p-3">
        <p className="label font-medium">{`${label}`}</p>
        <p className="text-[hsl(var(--chart-1))]">
          Claims: ₹{payload[0].value.toLocaleString()}
        </p>
        {payload[1] && (
          <p className="text-[hsl(var(--chart-4))]">
            Approvals: ₹{payload[1].value.toLocaleString()}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default function TrendAnalysisChart({ 
  title, 
  subtitle, 
  data, 
  trendPercentage,
  targetValue 
}: TrendAnalysisChartProps) {
  // Determine trend icon
  let TrendIcon = Minus;
  let trendColor = "text-muted-foreground";
  
  if (trendPercentage) {
    if (trendPercentage > 0) {
      TrendIcon = TrendingUp;
      trendColor = "text-emerald-500";
    } else if (trendPercentage < 0) {
      TrendIcon = TrendingDown;
      trendColor = "text-red-500";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            {trendPercentage !== undefined && (
              <div className={`flex items-center ${trendColor}`}>
                <TrendIcon className="mr-1 h-4 w-4" />
                <span className="text-sm font-medium">
                  {Math.abs(trendPercentage)}%
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="hsl(var(--border))" 
                />
                <XAxis 
                  dataKey="period" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip content={getCustomTooltip} />
                {targetValue && (
                  <ReferenceLine 
                    y={targetValue} 
                    label={{ 
                      value: "Target",
                      position: "right",
                      fill: "hsl(var(--foreground))",
                      fontSize: 12
                    }} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="3 3" 
                  />
                )}
                <Area 
                  type="monotone"
                  dataKey="claims"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorClaims)"
                  activeDot={{ r: 6 }}
                />
                <Area 
                  type="monotone"
                  dataKey="approvals"
                  stroke="hsl(var(--chart-4))"
                  fillOpacity={1}
                  fill="url(#colorApprovals)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] mr-2"></div>
              <span className="text-sm">Claims Submitted</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-4))] mr-2"></div>
              <span className="text-sm">Claims Approved</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
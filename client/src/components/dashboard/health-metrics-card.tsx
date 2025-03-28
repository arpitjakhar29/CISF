import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface HealthMetricsCardProps {
  title: string;
  subtitle: string;
  data: any[];
  overallScore?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip rounded-md border border-border bg-card shadow-sm p-3">
        <p className="label font-medium">{`${payload[0].payload.category}`}</p>
        <p className="text-[hsl(var(--chart-3))]">
          Value: {payload[0].value}
        </p>
        {payload[0].payload.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {payload[0].payload.description}
          </p>
        )}
      </div>
    );
  }

  return null;
};

export default function HealthMetricsCard({ 
  title, 
  subtitle, 
  data,
  overallScore
}: HealthMetricsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            {overallScore !== undefined && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary rounded-full px-3 py-1">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">{overallScore}</span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickCount={6}
                />
                <Tooltip content={CustomTooltip} />
                <Radar 
                  name="Health Score" 
                  dataKey="value" 
                  stroke="hsl(var(--chart-3))" 
                  fill="hsl(var(--chart-3))" 
                  fillOpacity={0.4} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 text-xs text-center text-muted-foreground">
            <p>This radar chart shows your health metrics on a scale of 0-10.</p>
            <p>Higher values indicate better health in each category.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
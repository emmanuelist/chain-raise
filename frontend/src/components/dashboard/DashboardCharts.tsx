import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const donationTrendData = [
  { date: "Jan", amount: 4500, donors: 23 },
  { date: "Feb", amount: 8200, donors: 45 },
  { date: "Mar", amount: 6100, donors: 31 },
  { date: "Apr", amount: 12300, donors: 67 },
  { date: "May", amount: 9800, donors: 52 },
  { date: "Jun", amount: 15600, donors: 89 },
  { date: "Jul", amount: 18200, donors: 102 },
];

const categoryData = [
  { name: "Technology", value: 45, color: "hsl(217, 91%, 60%)" },
  { name: "Environment", value: 25, color: "hsl(142, 76%, 45%)" },
  { name: "Education", value: 15, color: "hsl(280, 70%, 60%)" },
  { name: "Health", value: 10, color: "hsl(0, 84%, 60%)" },
  { name: "Other", value: 5, color: "hsl(35, 95%, 55%)" },
];

const milestoneData = [
  { name: "Completed", value: 8 },
  { name: "In Progress", value: 3 },
  { name: "Pending", value: 5 },
];

const timeRanges = ["7D", "30D", "90D", "All"];

// Debounce utility
const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-border/50 shadow-lg transition-all duration-150 ease-out">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground flex justify-between gap-4">
            <span>{entry.name === 'amount' ? 'Amount' : entry.name}:</span>
            <span className="text-primary font-medium">
              {entry.value.toLocaleString()} {entry.name === 'amount' ? 'STX' : ''}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DonationTrendChart() {
  const [activeRange, setActiveRange] = useState("30D");
  const [showDonors, setShowDonors] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Disable animations after initial render to prevent tooltip conflicts
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialRender(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    toast.success("Chart data exported!");
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Donation Trends
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-secondary/50 p-1">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md transition-all",
                    activeRange === range 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <Badge 
            variant={showDonors ? "outline" : "default"} 
            className="cursor-pointer text-xs"
            onClick={() => setShowDonors(false)}
          >
            Amount
          </Badge>
          <Badge 
            variant={showDonors ? "default" : "outline"} 
            className="cursor-pointer text-xs"
            onClick={() => setShowDonors(true)}
          >
            Donors
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="h-[200px] sm:h-[220px] lg:h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donationTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(187, 95%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(187, 95%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDonors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280, 70%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(280, 70%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                tickFormatter={(value) => showDonors ? value : `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={{ stroke: 'hsl(var(--primary))', strokeOpacity: 0.3 }}
              />
              <Area
                type="monotone"
                dataKey={showDonors ? "donors" : "amount"}
                stroke={showDonors ? "hsl(280, 70%, 60%)" : "hsl(187, 95%, 50%)"}
                strokeWidth={2}
                fill={showDonors ? "url(#colorDonors)" : "url(#colorAmount)"}
                isAnimationActive={isInitialRender}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryDistributionChart() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);

  // Disable animations after initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialRender(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Debounced hover handler to prevent rapid state changes
  const debouncedSetActiveCategory = useMemo(
    () => debounce((name: string | null) => setActiveCategory(name), 50),
    []
  );

  const handleMouseEnter = useCallback((index: number) => {
    debouncedSetActiveCategory(categoryData[index].name);
  }, [debouncedSetActiveCategory]);

  const handleMouseLeave = useCallback(() => {
    debouncedSetActiveCategory(null);
  }, [debouncedSetActiveCategory]);

  return (
    <Card className="glass-card h-full">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <PieChartIcon className="h-4 w-4 text-primary" />
          By Category
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="h-[160px] sm:h-[180px] lg:h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive={isInitialRender}
                animationDuration={1000}
                onMouseEnter={(_, index) => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={activeCategory === null || activeCategory === entry.name ? 1 : 0.4}
                    style={{ 
                      transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                animationDuration={150}
                animationEasing="ease-out"
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="glass-card p-3 border border-border/50 shadow-lg transition-all duration-150 ease-out">
                        <p className="text-sm font-medium">{payload[0].name}</p>
                        <p className="text-xs text-muted-foreground">
                          Share: <span className="text-primary font-medium">{payload[0].value}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Interactive Legend */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {categoryData.map((entry) => (
            <button
              key={entry.name}
              onMouseEnter={() => setActiveCategory(entry.name)}
              onMouseLeave={() => setActiveCategory(null)}
              className={cn(
                "flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all",
                activeCategory === entry.name 
                  ? "bg-secondary/80" 
                  : "hover:bg-secondary/50"
              )}
            >
              <div 
                className="w-2 h-2 rounded-full transition-transform"
                style={{ 
                  backgroundColor: entry.color,
                  transform: activeCategory === entry.name ? 'scale(1.3)' : 'scale(1)'
                }} 
              />
              <span className={cn(
                "text-muted-foreground transition-colors",
                activeCategory === entry.name && "text-foreground"
              )}>
                {entry.name}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MilestoneProgressChart() {
  return (
    <Card className="glass-card">
      <CardHeader className="p-4 sm:p-6 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <BarChart3 className="h-4 w-4 text-primary" />
          Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="h-[160px] sm:h-[180px] lg:h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={milestoneData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" horizontal={false} />
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                content={<CustomTooltip />}
                animationDuration={150}
                animationEasing="ease-out"
                cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(187, 95%, 50%)" 
                radius={[0, 4, 4, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

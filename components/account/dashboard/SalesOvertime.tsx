"use client";
import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from "recharts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#22c55e",
  },
} satisfies ChartConfig;

type SalesData = {
  date: string;
  revenue: number;
};

interface SalesOvertimeProps {
  thisMonthData: SalesData[];
  lastMonthData: SalesData[];
}

export function SalesOvertime({
  lastMonthData,
  thisMonthData,
}: SalesOvertimeProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "this-month" | "last-month"
  >("this-month");

  // Get the appropriate data based on selected period
  const salesData =
    selectedPeriod === "this-month" ? thisMonthData : lastMonthData;

  // Process the data to format dates nicely and ensure we have today's date
  const processedData = salesData.map((item) => {
    const date = new Date(item.date);
    return {
      ...item,
      formattedDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date.toLocaleDateString("en-KE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      revenue: Number(item.revenue) || 0,
    };
  });

  // If no data for today (Aug 31), you may need to check your backend date range generation
  // The issue might be in getDashboardStats() - ensure it includes today's date

  // Calculate some basic stats for display
  const totalRevenue = processedData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const avgDailyRevenue =
    processedData.length > 0 ? totalRevenue / processedData.length : 0;

  // Format currency in Kenyan Shillings
  const formatKES = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get period description
  const getPeriodDescription = () => {
    if (selectedPeriod === "this-month") {
      const currentMonth = new Date().toLocaleDateString("en-KE", {
        month: "long",
        year: "numeric",
      });
      return `${currentMonth} • Avg: ${formatKES(avgDailyRevenue)} per day`;
    } else {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthName = lastMonth.toLocaleDateString("en-KE", {
        month: "long",
        year: "numeric",
      });
      return `${lastMonthName} • Avg: ${formatKES(avgDailyRevenue)} per day`;
    }
  };

  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>{getPeriodDescription()}</CardDescription>
          </div>
          <Select
            value={selectedPeriod}
            onValueChange={(value: "this-month" | "last-month") =>
              setSelectedPeriod(value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={processedData}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={Math.max(Math.floor(processedData.length / 6), 0)}
              tick={{ fontSize: 12 }}
              height={40}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (value === 0) return "KES 0";
                if (value < 1000) return `KES ${value}`;
                return `KES ${(value / 1000).toFixed(0)}k`;
              }}
              tick={{ fontSize: 12 }}
              domain={[0, "dataMax"]}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `Date: ${payload[0].payload.fullDate}`;
                    }
                    return `Date: ${label}`;
                  }}
                  formatter={(value) => [
                    formatKES(Number(value)),
                    "Revenue",
                  ]}
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

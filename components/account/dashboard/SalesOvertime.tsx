"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
export const description = "A line chart";
const allMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
type SalesData = {
  month: string;
  sales?: number;
};
interface SalesOvertimeProps {
  salesData: SalesData[];
}
export function SalesOvertime({ salesData }: SalesOvertimeProps) {
  const normalizedData = allMonths.map((month) => {
    const found = salesData.find((d) => d.month === month);
    return {
      month,
      sales: found ? found.sales : null,
    };
  });
  return (
    <Card className="h-fit w-full">
      <CardHeader>
        <CardTitle>Sales Over Time</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={normalizedData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="sales"
              type="natural"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
              connectNulls={false} 
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

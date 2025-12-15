"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shipment } from "@/app/types";

interface MonthlyTrendChartProps {
  data: Shipment[];
  title?: string;
  description?: string;
  color?: string;
}

export function MonthlyTrendChart({ 
  data, 
  title = "Aylık Gönderim Trendi", 
  description = "Son 6 aylık sevkiyat hacmi (kg)",
  color = "#2563eb" 
}: MonthlyTrendChartProps) {

  const chartData = useMemo(() => {
    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const currentMonth = new Date().getMonth();
    
    const groupedData = new Array(12).fill(0);

    data.forEach(item => {
      const date = new Date(item.createdAt);
      const monthIndex = date.getMonth();
      groupedData[monthIndex] += item.amount;
    });
    
    // DÜZELTME: filter fonksiyonuna 'index' parametresi eklendi
    return months.map((month, index) => ({
      name: month,
      total: groupedData[index],
    })).filter((item, index) => item.total > 0 || (index >= currentMonth - 5 && index <= currentMonth));

  }, [data]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value}kg`} 
            />
            <Tooltip 
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="total" fill={color} radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
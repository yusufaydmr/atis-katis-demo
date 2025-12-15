"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shipment, WasteType } from "@/app/types";

interface WasteDistributionChartProps {
  shipments: Shipment[];
  wasteTypes: WasteType[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function WasteDistributionChart({ shipments, wasteTypes }: WasteDistributionChartProps) {

  const chartData = useMemo(() => {
    const dataMap: { [key: string]: number } = {};

    shipments.forEach(s => {
      if (dataMap[s.wasteTypeId]) {
        dataMap[s.wasteTypeId] += s.amount;
      } else {
        dataMap[s.wasteTypeId] = s.amount;
      }
    });

    return Object.keys(dataMap).map(typeId => {
      const waste = wasteTypes.find(w => w.id === typeId);
      return {
        name: waste ? `${waste.code} (${waste.name})` : "Bilinmeyen",
        value: dataMap[typeId]
      };
    });
  }, [shipments, wasteTypes]);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Atık Türü Dağılımı</CardTitle>
        <CardDescription>Toplam atık hacminin türlere göre oranı</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* DÜZELTME: value tipini 'any' yaparak hatayı giderdik */}
              <Tooltip formatter={(value: any) => `${Number(value).toLocaleString()} kg`} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
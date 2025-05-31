import React, { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Color logic for each priority level
const getBarColor = (priority) => {
  switch (priority) {
    case "Low":
      return "#00BC7D"; // Green
    case "Medium":
      return "#FE9900"; // Orange
    case "High":
      return "#FF1F57"; // Red
    default:
      return "#cccccc"; // Default Gray
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { priority, count } = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
        <p className="font-semibold">{priority}</p>
        <p>Count: {count}</p>
      </div>
    );
  }
  return null;
};

const CustomBarChart = memo(({ data }) => {
  return (
    <div className="w-full h-[325px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={60}>
          <XAxis
            dataKey="priority"
            tick={{ fontSize: 14, fill: "#222" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 14, fill: "#222" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar dataKey="count" radius={[12, 12, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={getBarColor(entry.priority)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default CustomBarChart;

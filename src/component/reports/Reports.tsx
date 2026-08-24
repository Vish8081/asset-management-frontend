import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

// 1. Define your TypeScript Interface
interface AssetData {
  name: string;
  value: number;
  percent?: number; 
}

// 2. Sample Data 
const data: AssetData[] = [
  { name: 'Laptops', value: 400, percent: 40 },
  { name: 'Monitors', value: 300, percent: 30 },
  { name: 'Desktops', value: 300, percent: 30 },
  { name: 'Tablets', value: 200 }, 
];

// 3. Colors for the Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Asset Reports</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
        
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => {
                  return `${name}: ${(percent ?? 0).toFixed(0)}%`;
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              
              {/* 
                  FINAL FIX: Using 'any' for value removes TypeScript's strict generic comparison.
                  Our JavaScript logic 'value ?? 0' safely handles undefined/null inside the function.
              */}
              <Tooltip 
                formatter={(value: any, name: string, props: any) => {
                  const safeValue = value ?? 0;
                  const percent = props?.payload?.percent ?? 0;
                  return [`${safeValue} (${percent}%)`, name];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
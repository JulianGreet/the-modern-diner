
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, Calendar, Download } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const salesData = [
  { name: 'Mon', sales: 3200 },
  { name: 'Tue', sales: 4500 },
  { name: 'Wed', sales: 5200 },
  { name: 'Thu', sales: 4800 },
  { name: 'Fri', sales: 6500 },
  { name: 'Sat', sales: 7800 },
  { name: 'Sun', sales: 6300 },
];

const tableData = [
  { name: 'A1', turnover: 8 },
  { name: 'A2', turnover: 7 },
  { name: 'A3', turnover: 5 },
  { name: 'A4', turnover: 6 },
  { name: 'B1', turnover: 4 },
  { name: 'B2', turnover: 5 },
  { name: 'C1', turnover: 7 },
  { name: 'C2', turnover: 6 },
  { name: 'C3', turnover: 5 },
];

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <Calendar size={16} className="mr-2" />
            Date Range
          </Button>
          <Button>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">$34,580</CardTitle>
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>14% increase from last week</span>
              <BarChart size={16} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">642</CardTitle>
            <CardDescription>Orders Completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>8% increase from last week</span>
              <LineChart size={16} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">46 min</CardTitle>
            <CardDescription>Average Table Time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>5 min less than last week</span>
              <LineChart size={16} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
              <CardDescription>Sales data for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#800020" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tables" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Table Turnover Rate</CardTitle>
              <CardDescription>Average daily turnover per table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={tableData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="turnover" fill="#36454F" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Server metrics and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                Staff performance data will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="menu" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Analysis</CardTitle>
              <CardDescription>Popularity and profitability of menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                Menu analysis data will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;

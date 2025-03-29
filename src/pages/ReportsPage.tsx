
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, Calendar, Download, Loader2 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, subDays } from 'date-fns';
import { fetchAnalyticsSummary, fetchDailySales, fetchTableTurnover, fetchPopularMenuItems } from '@/services/supabase/reportService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReportsPage: React.FC = () => {
  // State for date range picker
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const end = new Date();
    const start = subDays(end, 7); // Default to last 7 days
    return { start, end };
  });
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    ordersCompleted: 0,
    averageTableTime: 0,
    revenueChange: 0,
    ordersChange: 0,
    tableTimeChange: 0
  });
  
  // State for chart data
  const [salesData, setSalesData] = useState<Array<{ name: string; sales: number }>>([]);
  const [tableData, setTableData] = useState<Array<{ name: string; turnover: number }>>([]);
  const [menuData, setMenuData] = useState<Array<{ name: string; quantity: number; revenue: number }>>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Fetch all data when component mounts or date range changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch analytics summary
        const analytics = await fetchAnalyticsSummary(dateRange);
        setAnalyticsData(analytics);
        
        // Fetch sales data
        const sales = await fetchDailySales(dateRange);
        setSalesData(sales);
        
        // Fetch table turnover data
        const tables = await fetchTableTurnover(dateRange);
        setTableData(tables);
        
        // Fetch popular menu items
        const menuItems = await fetchPopularMenuItems(dateRange);
        setMenuData(menuItems);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle date range selection
  const handleDateRangeSelect = (date: Date) => {
    setDateRange(prev => {
      // If no date is selected yet or both dates are selected, start a new range
      if (!prev.start || (prev.start && prev.end)) {
        return {
          start: date,
          end: date
        };
      }
      // If start date is selected but not end date
      else if (prev.start && !prev.end) {
        // If selected date is before start date, swap them
        if (date < prev.start) {
          return {
            start: date,
            end: prev.start
          };
        }
        // Otherwise, set as end date
        return {
          start: prev.start,
          end: date
        };
      }
      return prev;
    });
    
    // Close the date picker if both dates are selected
    if (dateRange.start && dateRange.end) {
      setIsDatePickerOpen(false);
    }
  };
  
  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.start || !dateRange.end) return 'Select date range';
    return `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="space-x-2">
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar size={16} className="mr-2" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={{
                  from: dateRange.start,
                  to: dateRange.end
                }}
                onSelect={(range) => {
                  if (range?.from) {
                    setDateRange({
                      start: range.from,
                      end: range.to || range.from
                    });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{formatCurrency(analyticsData.totalRevenue)}</CardTitle>
                <CardDescription>Total Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>
                    {analyticsData.revenueChange > 0 ? (
                      <span className="text-green-600">{analyticsData.revenueChange}% increase</span>
                    ) : analyticsData.revenueChange < 0 ? (
                      <span className="text-red-600">{Math.abs(analyticsData.revenueChange)}% decrease</span>
                    ) : (
                      <span>No change</span>
                    )}
                    {' from previous period'}
                  </span>
                  <BarChart size={16} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{analyticsData.ordersCompleted}</CardTitle>
                <CardDescription>Orders Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>
                    {analyticsData.ordersChange > 0 ? (
                      <span className="text-green-600">{analyticsData.ordersChange}% increase</span>
                    ) : analyticsData.ordersChange < 0 ? (
                      <span className="text-red-600">{Math.abs(analyticsData.ordersChange)}% decrease</span>
                    ) : (
                      <span>No change</span>
                    )}
                    {' from previous period'}
                  </span>
                  <LineChart size={16} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">{analyticsData.averageTableTime} min</CardTitle>
                <CardDescription>Average Table Time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>
                    {analyticsData.tableTimeChange < 0 ? (
                      <span className="text-green-600">{Math.abs(analyticsData.tableTimeChange)} min less</span>
                    ) : analyticsData.tableTimeChange > 0 ? (
                      <span className="text-red-600">{analyticsData.tableTimeChange} min more</span>
                    ) : (
                      <span>No change</span>
                    )}
                    {' from previous period'}
                  </span>
                  <LineChart size={16} />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {!isLoading && (
        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales</CardTitle>
                <CardDescription>Sales data for the selected period</CardDescription>
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
                      <RechartsTooltip formatter={(value) => [formatCurrency(value as number), 'Sales']} />
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
                <CardDescription>Number of completed orders per table</CardDescription>
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
                      <RechartsTooltip formatter={(value) => [`${value} orders`, 'Turnover']} />
                      <Bar dataKey="turnover" fill="#36454F" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
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
                {menuData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead className="text-right">Quantity Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    No menu data available for the selected period
                  </div>
                )}
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
                  Staff performance analytics coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ReportsPage;

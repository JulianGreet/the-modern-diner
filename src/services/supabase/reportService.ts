import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, OrderStatus } from "@/types/restaurant";

// Interface for analytics data
export interface AnalyticsData {
  totalRevenue: number;
  ordersCompleted: number;
  averageTableTime: number; // in minutes
  revenueChange: number; // percentage
  ordersChange: number; // percentage
  tableTimeChange: number; // in minutes
}

// Interface for daily sales data
export interface DailySalesData {
  name: string; // day name
  sales: number;
}

// Interface for table turnover data
export interface TableTurnoverData {
  name: string; // table name
  turnover: number; // number of times the table was used
}

// Interface for menu item popularity
export interface MenuItemPopularity {
  name: string;
  quantity: number;
  revenue: number;
}

/**
 * Fetch analytics summary data for the dashboard
 * @param dateRange Optional date range filter
 * @returns Analytics summary data
 */
export async function fetchAnalyticsSummary(
  dateRange?: { start: Date; end: Date }
): Promise<AnalyticsData> {
  try {
    // Build the query with date range filter if provided
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          menu_item_id,
          quantity,
          status,
          started_at,
          completed_at,
          menu_items:menu_items(
            price
          )
        )
      `);

    // Apply date range filter if provided
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    }

    // Get current period data
    const { data: currentData, error } = await query;

    if (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }

    // Calculate total revenue
    const totalRevenue = currentData.reduce((total, order) => {
      const orderTotal = order.order_items.reduce((sum, item) => {
        return sum + (item.menu_items?.price || 0) * item.quantity;
      }, 0);
      return total + orderTotal;
    }, 0);

    // Count completed orders
    const ordersCompleted = currentData.filter(
      (order) => order.status === 'completed'
    ).length;

    // Calculate average table time (from order creation to completion)
    let totalTableTime = 0;
    let completedOrdersWithTime = 0;

    currentData.forEach((order) => {
      if (order.status === 'completed') {
        const createdAt = new Date(order.created_at).getTime();
        const updatedAt = new Date(order.updated_at).getTime();
        const timeSpent = (updatedAt - createdAt) / (1000 * 60); // Convert to minutes
        totalTableTime += timeSpent;
        completedOrdersWithTime++;
      }
    });

    const averageTableTime = completedOrdersWithTime > 0 
      ? Math.round(totalTableTime / completedOrdersWithTime) 
      : 0;

    // Get previous period data for comparison
    // For simplicity, we'll use the same duration as the current period but shifted back
    let previousQuery = supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          menu_item_id,
          quantity,
          status,
          started_at,
          completed_at,
          menu_items:menu_items(
            price
          )
        )
      `);

    if (dateRange) {
      const duration = dateRange.end.getTime() - dateRange.start.getTime();
      const previousStart = new Date(dateRange.start.getTime() - duration);
      const previousEnd = new Date(dateRange.end.getTime() - duration);
      
      previousQuery = previousQuery
        .gte('created_at', previousStart.toISOString())
        .lte('created_at', previousEnd.toISOString());
    } else {
      // Default to previous week if no date range provided
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      
      previousQuery = previousQuery
        .gte('created_at', twoWeeksAgo.toISOString())
        .lte('created_at', oneWeekAgo.toISOString());
    }

    const { data: previousData, error: previousError } = await previousQuery;

    if (previousError) {
      console.error('Error fetching previous period data:', previousError);
      // Continue with current data only
    }

    // Calculate previous period metrics
    let previousRevenue = 0;
    let previousOrdersCompleted = 0;
    let previousAverageTableTime = 0;

    if (previousData) {
      // Calculate previous revenue
      previousRevenue = previousData.reduce((total, order) => {
        const orderTotal = order.order_items.reduce((sum, item) => {
          return sum + (item.menu_items?.price || 0) * item.quantity;
        }, 0);
        return total + orderTotal;
      }, 0);

      // Count previous completed orders
      previousOrdersCompleted = previousData.filter(
        (order) => order.status === 'completed'
      ).length;

      // Calculate previous average table time
      let prevTotalTableTime = 0;
      let prevCompletedOrdersWithTime = 0;

      previousData.forEach((order) => {
        if (order.status === 'completed') {
          const createdAt = new Date(order.created_at).getTime();
          const updatedAt = new Date(order.updated_at).getTime();
          const timeSpent = (updatedAt - createdAt) / (1000 * 60); // Convert to minutes
          prevTotalTableTime += timeSpent;
          prevCompletedOrdersWithTime++;
        }
      });

      previousAverageTableTime = prevCompletedOrdersWithTime > 0 
        ? Math.round(prevTotalTableTime / prevCompletedOrdersWithTime) 
        : 0;
    }

    // Calculate percentage changes
    const revenueChange = previousRevenue > 0 
      ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100) 
      : 0;
    
    const ordersChange = previousOrdersCompleted > 0 
      ? Math.round(((ordersCompleted - previousOrdersCompleted) / previousOrdersCompleted) * 100) 
      : 0;
    
    const tableTimeChange = previousAverageTableTime > 0 
      ? averageTableTime - previousAverageTableTime 
      : 0;

    return {
      totalRevenue,
      ordersCompleted,
      averageTableTime,
      revenueChange,
      ordersChange,
      tableTimeChange
    };
  } catch (error) {
    console.error('Error in fetchAnalyticsSummary:', error);
    // Return default values in case of error
    return {
      totalRevenue: 0,
      ordersCompleted: 0,
      averageTableTime: 0,
      revenueChange: 0,
      ordersChange: 0,
      tableTimeChange: 0
    };
  }
}

/**
 * Fetch daily sales data for the sales chart
 * @param dateRange Optional date range filter
 * @returns Array of daily sales data
 */
export async function fetchDailySales(
  dateRange?: { start: Date; end: Date }
): Promise<DailySalesData[]> {
  try {
    // Build the query with date range filter if provided
    let query = supabase
      .from('orders')
      .select(`
        created_at,
        order_items:order_items(
          quantity,
          menu_items:menu_items(
            price
          )
        )
      `);

    // Apply date range filter if provided
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    } else {
      // Default to last 7 days
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = query.gte('created_at', oneWeekAgo.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching daily sales data:', error);
      throw error;
    }

    // Group sales by day
    const salesByDay = new Map<string, number>();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Initialize all days with zero sales
    for (const day of dayNames) {
      salesByDay.set(day, 0);
    }

    // Calculate sales for each day
    data.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const dayName = dayNames[orderDate.getDay()];
      
      const orderTotal = order.order_items.reduce((sum, item) => {
        return sum + (item.menu_items?.price || 0) * item.quantity;
      }, 0);

      salesByDay.set(dayName, (salesByDay.get(dayName) || 0) + orderTotal);
    });

    // Convert to array format for the chart
    const result: DailySalesData[] = [];
    
    // Start with the current day and go backward to get the last 7 days in order
    const today = new Date().getDay();
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today - i + 7) % 7; // Ensure positive index
      const dayName = dayNames[dayIndex];
      result.unshift({ name: dayName, sales: Math.round(salesByDay.get(dayName) || 0) });
    }

    return result;
  } catch (error) {
    console.error('Error in fetchDailySales:', error);
    return [];
  }
}

/**
 * Fetch table turnover data for the tables chart
 * @param dateRange Optional date range filter
 * @returns Array of table turnover data
 */
export async function fetchTableTurnover(
  dateRange?: { start: Date; end: Date }
): Promise<TableTurnoverData[]> {
  try {
    // First, get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('id, name')
      .order('name');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      throw tablesError;
    }

    // Build the query for orders with date range filter if provided
    let query = supabase
      .from('orders')
      .select('table_id, status');

    // Apply date range filter if provided
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    } else {
      // Default to last 7 days
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = query.gte('created_at', oneWeekAgo.toISOString());
    }

    // Only count completed orders
    query = query.eq('status', 'completed');

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error('Error fetching orders for table turnover:', ordersError);
      throw ordersError;
    }

    // Count orders per table
    const orderCountByTable = new Map<number, number>();
    orders.forEach((order) => {
      const tableId = order.table_id;
      orderCountByTable.set(tableId, (orderCountByTable.get(tableId) || 0) + 1);
    });

    // Create result array
    const result: TableTurnoverData[] = tables.map((table) => ({
      name: table.name,
      turnover: orderCountByTable.get(table.id) || 0
    }));

    // Sort by turnover (descending)
    return result.sort((a, b) => b.turnover - a.turnover);
  } catch (error) {
    console.error('Error in fetchTableTurnover:', error);
    return [];
  }
}

/**
 * Fetch popular menu items data
 * @param dateRange Optional date range filter
 * @param limit Maximum number of items to return
 * @returns Array of menu item popularity data
 */
export async function fetchPopularMenuItems(
  dateRange?: { start: Date; end: Date },
  limit: number = 10
): Promise<MenuItemPopularity[]> {
  try {
    // Build the query with date range filter if provided
    let query = supabase
      .from('orders')
      .select(`
        created_at,
        order_items:order_items(
          menu_item_id,
          quantity,
          menu_items:menu_items(
            name,
            price
          )
        )
      `);

    // Apply date range filter if provided
    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    } else {
      // Default to last 30 days
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      query = query.gte('created_at', thirtyDaysAgo.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching menu item data:', error);
      throw error;
    }

    // Aggregate menu item data
    const menuItemMap = new Map<number, { name: string; quantity: number; revenue: number }>();

    data.forEach((order) => {
      order.order_items.forEach((item) => {
        if (item.menu_items) {
          const menuItemId = item.menu_item_id;
          const name = item.menu_items.name;
          const price = item.menu_items.price;
          const quantity = item.quantity;
          const revenue = price * quantity;

          if (menuItemMap.has(menuItemId)) {
            const existing = menuItemMap.get(menuItemId)!;
            existing.quantity += quantity;
            existing.revenue += revenue;
          } else {
            menuItemMap.set(menuItemId, { name, quantity, revenue });
          }
        }
      });
    });

    // Convert to array and sort by quantity
    const result: MenuItemPopularity[] = Array.from(menuItemMap.values())
      .map(item => ({
        name: item.name,
        quantity: item.quantity,
        revenue: Math.round(item.revenue * 100) / 100 // Round to 2 decimal places
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    return result;
  } catch (error) {
    console.error('Error in fetchPopularMenuItems:', error);
    return [];
  }
}
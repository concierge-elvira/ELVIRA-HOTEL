/**
 * Analytics Types
 * TypeScript interfaces for hotel analytics data
 */

// ============================================================================
// Time-based Data Types
// ============================================================================

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

export interface MultiSeriesDataPoint {
  date: string;
  [key: string]: string | number;
}

// ============================================================================
// Guest Analytics
// ============================================================================

export interface GuestAnalytics {
  totalGuests: number;
  activeGuests: number;
  newGuestsToday: number;
  newGuestsThisWeek: number;
  newGuestsThisMonth: number;
  checkInsToday: number;
  checkOutsToday: number;
  averageStayDuration: number;
  guestSatisfactionScore: number;
  repeatGuestRate: number;
}

export interface GuestDemographics {
  ageGroups: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  countries: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  guestTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

export interface GuestTrends {
  daily: TimeSeriesDataPoint[];
  weekly: TimeSeriesDataPoint[];
  monthly: TimeSeriesDataPoint[];
  checkIns: TimeSeriesDataPoint[];
  checkOuts: TimeSeriesDataPoint[];
}

// ============================================================================
// Revenue Analytics
// ============================================================================

export interface RevenueAnalytics {
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  averageDailyRevenue: number;
  revenueGrowth: number; // percentage
  revenuePerGuest: number;
}

export interface RevenueBySource {
  restaurant: number;
  shop: number;
  amenities: number;
  roomService: number;
  other: number;
}

export interface RevenueTrends {
  daily: TimeSeriesDataPoint[];
  weekly: TimeSeriesDataPoint[];
  monthly: TimeSeriesDataPoint[];
  bySource: MultiSeriesDataPoint[];
}

// ============================================================================
// Operations Analytics
// ============================================================================

export interface OperationsAnalytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  averageOrderTime: number; // in minutes
  orderCompletionRate: number; // percentage
}

export interface OrderAnalytics {
  dineIn: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
  shop: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
  amenities: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
}

export interface OrderTrends {
  daily: MultiSeriesDataPoint[];
  hourly: MultiSeriesDataPoint[];
  byType: Array<{
    type: string;
    count: number;
    revenue: number;
  }>;
}

// ============================================================================
// Staff Analytics
// ============================================================================

export interface StaffAnalytics {
  totalStaff: number;
  activeStaff: number;
  totalSchedules: number;
  totalAbsences: number;
  pendingAbsences: number;
  totalDepartments: number;
  staffByDepartment: Array<{
    name: string;
    value: number;
  }>;
  staffByPosition: Array<{
    name: string;
    value: number;
  }>;
  staffByStatus: Array<{
    name: string;
    value: number;
  }>;
  schedulesByStatus: Array<{
    name: string;
    count: number;
  }>;
  absencesByType: Array<{
    name: string;
    value: number;
  }>;
  absencesByStatus: Array<{
    name: string;
    count: number;
  }>;
  departmentPerformance: Array<{
    name: string;
    completed: number;
    total: number;
    rate: number;
  }>;
}

export interface StaffPerformance {
  byDepartment: Array<{
    department: string;
    staffCount: number;
    tasksCompleted: number;
    averageRating: number;
  }>;
  topPerformers: Array<{
    staffId: string;
    name: string;
    tasksCompleted: number;
    rating: number;
  }>;
}

// ============================================================================
// Communication Analytics
// ============================================================================

export interface CommunicationAnalytics {
  totalConversations: number;
  openConversations: number;
  closedConversations: number;
  totalMessages: number;
  unreadMessages: number;
  averageResponseTime: number; // in minutes
  customerSatisfaction: number; // percentage
}

export interface MessageTrends {
  daily: TimeSeriesDataPoint[];
  hourly: MultiSeriesDataPoint[];
  byType: Array<{
    type: string;
    count: number;
  }>;
}

// ============================================================================
// Inventory Analytics
// ============================================================================

export interface InventoryAnalytics {
  totalMenuItems: number;
  activeMenuItems: number;
  totalProducts: number;
  activeProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  topSellingItems: Array<{
    id: string;
    name: string;
    category: string;
    orderCount: number;
    revenue: number;
  }>;
}

// ============================================================================
// Occupancy Analytics
// ============================================================================

export interface OccupancyAnalytics {
  currentOccupancy: number;
  occupancyRate: number; // percentage
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  averageOccupancyRate: number; // percentage
  peakOccupancyTime: string;
}

export interface OccupancyTrends {
  daily: TimeSeriesDataPoint[];
  weekly: TimeSeriesDataPoint[];
  monthly: TimeSeriesDataPoint[];
  hourly: TimeSeriesDataPoint[];
}

// ============================================================================
// Comprehensive Dashboard Analytics
// ============================================================================

export interface DashboardAnalytics {
  guest: GuestAnalytics;
  guestDemographics: GuestDemographics;
  guestTrends: GuestTrends;
  revenue: RevenueAnalytics;
  revenueBySource: RevenueBySource;
  revenueTrends: RevenueTrends;
  operations: OperationsAnalytics;
  orders: OrderAnalytics;
  orderTrends: OrderTrends;
  staff: StaffAnalytics;
  staffPerformance: StaffPerformance;
  communication: CommunicationAnalytics;
  messageTrends: MessageTrends;
  inventory: InventoryAnalytics;
  occupancy: OccupancyAnalytics;
  occupancyTrends: OccupancyTrends;
}

// ============================================================================
// Date Range Filter
// ============================================================================

export type DateRangeFilter =
  | "today"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// ============================================================================
// Chart Configuration
// ============================================================================

export interface ChartColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  [key: string]: string;
}

export interface ChartConfig {
  colors: ChartColors;
  responsive: boolean;
  animated: boolean;
  showGrid: boolean;
  showLegend: boolean;
  showTooltip: boolean;
}

// ============================================================================
// AI Analytics
// ============================================================================

export interface GuestMessageAnalytics {
  totalMessages: number;
  analyzedMessages: number;
  averageSentiment: number;
  topTopics: TopicCount[];
  topSubtopics: SubtopicCount[];
  sentimentDistribution: SentimentData[];
  messagesByGuest: GuestMessageData[];
  topicTrends: TopicTrendData[];
  urgencyDistribution: UrgencyData[];
}

export interface TopicCount {
  topic: string;
  count: number;
  percentage: number;
  cumulativePercentage: number;
  subtopics: SubtopicCount[];
}

export interface SubtopicCount {
  subtopic: string;
  count: number;
  percentage: number;
  cumulativePercentage: number;
}

export interface SentimentData {
  sentiment: string;
  count: number;
}

export interface GuestMessageData {
  guestId: string;
  guestName: string;
  email: string;
  messageCount: number;
  lastMessageDate: string;
  averageSentiment: string;
  topTopics: string[];
  [key: string]: unknown;
}

export interface TopicTrendData {
  date: string;
  [topic: string]: string | number;
}

export interface UrgencyData {
  urgency: string;
  count: number;
}

export interface MessageWithGuest {
  id: string;
  message_text: string;
  topics: string[] | null;
  subtopics: string | null;
  sentiment: string | null;
  urgency: string | null;
  created_at: string;
  guest_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
}

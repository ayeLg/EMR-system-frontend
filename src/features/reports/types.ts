export interface KpiStats {
  totalPatients: number;
  todayAppointments: number;
  revenueToday: number;
  pendingLab: number;
}

export interface CensusSeriesItem {
  date: string;
  patients: number;
}

export interface RevenueByDeptItem {
  dept: string;
  revenue: number;
}

export interface DiseaseBurdenItem {
  disease: string;
  count: number;
}

export interface AppointmentStatusItem {
  type: string;
  value: number;
}

export interface DashboardStats {
  kpis: KpiStats;
  censusSeries: CensusSeriesItem[];
  revenueByDept: RevenueByDeptItem[];
  diseaseBurden: DiseaseBurdenItem[];
  apptStatusBreakdown: AppointmentStatusItem[];
}

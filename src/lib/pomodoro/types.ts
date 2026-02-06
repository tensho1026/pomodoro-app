export type PomodoroSession = {
  id: string;
  userId: string;
  title: string;
  note: string;
  minutesPerSet: number;
  setCount: number;
  startedAt: string;
  createdAt: string;
};

export type CreatePomodoroSessionInput = {
  userId: string;
  title: string;
  note: string;
  minutesPerSet: number;
  setCount: number;
  startedAt: string;
};

export type DaySummary = {
  dateKey: string;
  dateLabel: string;
  totalMinutes: number;
  totalSets: number;
  sessionCount: number;
  sessions: PomodoroSession[];
};

export type DashboardViewModel = {
  todayMinutes: number;
  todaySets: number;
  averageDailyMinutes: number;
  totalMinutes: number;
  totalSets: number;
  totalSessions: number;
  activeDays: number;
  recentSessions: PomodoroSession[];
};

export type AnalyticsViewModel = {
  averageDailyMinutes: number;
  averageSetsPerDay: number;
  bestDayMinutes: number;
  chartData: Array<{
    dateKey: string;
    dateLabel: string;
    totalMinutes: number;
    totalSets: number;
    ratio: number;
  }>;
};

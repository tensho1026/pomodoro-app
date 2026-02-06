import { format } from "date-fns";

import {
  formatDayLabel,
} from "@/lib/pomodoro/format";
import { listPomodoroSessionsByUser } from "@/lib/pomodoro/repository";
import type {
  AnalyticsViewModel,
  DashboardViewModel,
  DaySummary,
  PomodoroSession,
} from "@/lib/pomodoro/types";

function totalMinutesOfSession(session: PomodoroSession) {
  return session.minutesPerSet * session.setCount;
}

function toDateKey(isoDate: string) {
  return format(new Date(isoDate), "yyyy-MM-dd");
}

function groupSessionsByDay(sessions: PomodoroSession[]): DaySummary[] {
  const dailyMap = new Map<string, DaySummary>();

  for (const session of sessions) {
    const dateKey = toDateKey(session.startedAt);
    const sessionTotalMinutes = totalMinutesOfSession(session);

    const currentValue = dailyMap.get(dateKey);

    if (!currentValue) {
      dailyMap.set(dateKey, {
        dateKey,
        dateLabel: formatDayLabel(dateKey),
        totalMinutes: sessionTotalMinutes,
        totalSets: session.setCount,
        sessionCount: 1,
        sessions: [session],
      });
      continue;
    }

    currentValue.totalMinutes += sessionTotalMinutes;
    currentValue.totalSets += session.setCount;
    currentValue.sessionCount += 1;
    currentValue.sessions.push(session);
  }

  const grouped = Array.from(dailyMap.values()).sort((left, right) =>
    right.dateKey.localeCompare(left.dateKey),
  );

  for (const day of grouped) {
    day.sessions.sort(
      (left, right) =>
        new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
    );
  }

  return grouped;
}

export async function getDashboardViewModel(
  userId: string,
): Promise<DashboardViewModel> {
  const sessions = await listPomodoroSessionsByUser(userId);
  const groupedDays = groupSessionsByDay(sessions);

  const todayDateKey = format(new Date(), "yyyy-MM-dd");
  const todaySummary = groupedDays.find((day) => day.dateKey === todayDateKey);

  const totalMinutes = groupedDays.reduce(
    (sum, day) => sum + day.totalMinutes,
    0,
  );
  const totalSets = groupedDays.reduce((sum, day) => sum + day.totalSets, 0);

  return {
    todayMinutes: todaySummary?.totalMinutes ?? 0,
    todaySets: todaySummary?.totalSets ?? 0,
    averageDailyMinutes:
      groupedDays.length > 0 ? Math.round(totalMinutes / groupedDays.length) : 0,
    totalMinutes,
    totalSets,
    totalSessions: sessions.length,
    activeDays: groupedDays.length,
    recentSessions: sessions.slice(0, 10),
  };
}

export async function getHistoryViewModel(userId: string): Promise<DaySummary[]> {
  const sessions = await listPomodoroSessionsByUser(userId);
  return groupSessionsByDay(sessions);
}

export async function getAnalyticsViewModel(
  userId: string,
): Promise<AnalyticsViewModel> {
  const groupedDays = await getHistoryViewModel(userId);

  if (groupedDays.length === 0) {
    return {
      averageDailyMinutes: 0,
      averageSetsPerDay: 0,
      bestDayMinutes: 0,
      chartData: [],
    };
  }

  const totalMinutes = groupedDays.reduce(
    (sum, day) => sum + day.totalMinutes,
    0,
  );
  const totalSets = groupedDays.reduce((sum, day) => sum + day.totalSets, 0);
  const bestDayMinutes = Math.max(...groupedDays.map((day) => day.totalMinutes));

  const chartData = [...groupedDays]
    .reverse()
    .map((day) => ({
      dateKey: day.dateKey,
      dateLabel: day.dateLabel,
      totalMinutes: day.totalMinutes,
      totalSets: day.totalSets,
      ratio: Math.max(6, Math.round((day.totalMinutes / bestDayMinutes) * 100)),
    }));

  return {
    averageDailyMinutes: Math.round(totalMinutes / groupedDays.length),
    averageSetsPerDay: Number((totalSets / groupedDays.length).toFixed(1)),
    bestDayMinutes,
    chartData,
  };
}

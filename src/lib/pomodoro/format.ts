import { format } from "date-fns";
import { ja } from "date-fns/locale";

export function formatMinutes(minutes: number) {
  return `${minutes.toLocaleString("ja-JP")}分`;
}

export function formatSets(setCount: number) {
  return `${setCount.toLocaleString("ja-JP")}セット`;
}

export function formatSessionDateTime(isoDate: string) {
  return format(new Date(isoDate), "M/d(E) HH:mm", { locale: ja });
}

export function formatDayLabel(dateKey: string) {
  return format(new Date(`${dateKey}T00:00:00`), "M/d(E)", { locale: ja });
}

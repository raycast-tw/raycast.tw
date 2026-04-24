import { format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy", { locale: zhTW });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy HH:mm", { locale: zhTW });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function formatFullDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "EEEE, MMMM d, yyyy", { locale: zhTW });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

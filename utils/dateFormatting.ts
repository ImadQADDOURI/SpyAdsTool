// utils/dateFormatting.ts

import { formatDistanceToNow } from "date-fns";

export function formatDate(dateString: string | number | Date): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Unknown date";
  }
}

import { MonthlyStatsResponseDto } from '../dtos/monthly-stats-response.dto';

/**
 * Transforms raw monthly statistics data into a structured format
 * with proper date ranges for each month within the given period.
 *
 * @param rawData - Raw data from database query with month and count fields
 * @param startDate - Start date of the statistics period
 * @param endDate - End date of the statistics period
 * @returns Array of monthly statistics with from, to, and count fields
 */
export function transformToMonthlyStats(
  rawData: any[],
  startDate: Date,
  endDate: Date,
): MonthlyStatsResponseDto[] {
  const dataMap = new Map(
    rawData.map((row) => [
      new Date(row.month).toISOString().substring(0, 7),
      row.count,
    ]),
  );

  const result: MonthlyStatsResponseDto[] = [];
  let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const last = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (current <= last) {
    const monthKey = current.toISOString().substring(0, 7);

    const from =
      current.getTime() ===
      new Date(startDate.getFullYear(), startDate.getMonth(), 1).getTime()
        ? startDate
        : new Date(current);

    const to =
      current.getTime() === last.getTime()
        ? endDate
        : new Date(
            Date.UTC(
              current.getFullYear(),
              current.getMonth() + 1,
              0,
              23,
              59,
              59,
              999,
            ),
          );

    result.push({
      from,
      to,
      count: dataMap.get(monthKey) || 0,
    });

    current.setMonth(current.getMonth() + 1);
  }

  return result;
}

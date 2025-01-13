import { useState, useMemo, useCallback } from "react";

export type TCalendarCellType = "next" | "prev" | "current";
export interface ICalendarPanel {
  year: number;
  month: number;
}
export interface ICalendarCell {
  date: number;
  month: number;
  year: number;
  type: TCalendarCellType;
}
export interface ICalendarHook {
  cells: ICalendarCell[];
  panel: ICalendarPanel;
  dayNames: string[];
  monthNames: string[];
  onPrevYear: () => void;
  onNextYear: () => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
}

const CELL_COUNT = 7 * 6;
const currentIndexDay = [6, 0, 1, 2, 3, 4, 5];

const getCurrentMonthDays = (panel: ICalendarPanel): ICalendarCell[] => {
  const { year, month } = panel;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    year,
    month,
    date: i + 1,
    type: "current",
  }));
};

const getPrevMonthDays = (panel: ICalendarPanel): ICalendarCell[] => {
  const { year, month } = panel;
  const cellsCount = currentIndexDay[new Date(year, month, 1).getDay()];
  const daysInMonth = new Date(year, month, 0).getDate();
  const [cellYear, cellMonth] =
    month === 0 ? [year - 1, 11] : [year, month - 1];
  return Array.from({ length: cellsCount }, (_, i) => ({
    year: cellYear,
    month: cellMonth,
    date: daysInMonth - cellsCount + i + 1,
    type: "prev",
  }));
};

const getNextMonthDays = (panel: ICalendarPanel): ICalendarCell[] => {
  const { year, month } = panel;
  const prevMonthDaysCount = currentIndexDay[new Date(year, month, 1).getDay()];
  const currentMonthDaysCount = new Date(year, month + 1, 0).getDate();
  const nextMonthDaysCount =
    CELL_COUNT - currentMonthDaysCount - prevMonthDaysCount;
  const [cellYear, cellMonth] =
    month === 11 ? [year + 1, 0] : [year, month + 1];
  return Array.from({ length: nextMonthDaysCount }, (_, i) => ({
    year: cellYear,
    month: cellMonth,
    date: i + 1,
    type: "next",
  }));
};

export default function useCalendar(): ICalendarHook {
  const [panel, setPanel] = useState<ICalendarPanel>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const cells = useMemo(() => {
    const currentDays = getCurrentMonthDays(panel);
    const prevDays = getPrevMonthDays(panel);
    const nextDays = getNextMonthDays(panel);
    return [...prevDays, ...currentDays, ...nextDays];
  }, [panel]);

  const onPrevYear = useCallback(
    () => setPanel((prev) => ({ ...prev, year: prev.year - 1 })),
    []
  );
  const onNextYear = useCallback(
    () => setPanel((prev) => ({ ...prev, year: prev.year + 1 })),
    []
  );

  const changeMonth = (value: number) => {
    const { year, month } = panel;
    const totalMonths = month + value;
    const newYear = year + Math.floor(totalMonths / 12);
    const newMonth = ((totalMonths % 12) + 12) % 12;
    setPanel((prev) => ({ ...prev, month: newMonth, year: newYear }));
  };

  const onNextMonth = useCallback(() => changeMonth(1), [panel]);
  const onPrevMonth = useCallback(() => changeMonth(-1), [panel]);

  return {
    cells,
    panel,
    dayNames,
    monthNames,
    onPrevYear,
    onNextYear,
    onNextMonth,
    onPrevMonth,
  };
}

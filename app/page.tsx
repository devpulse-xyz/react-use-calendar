"use client";

import useCalendar from "./hooks/useCalendar";
import cn from "./utils/cn";

export default function Home() {
  const { cells, panel, monthNames, onPrevYear, onNextYear, onNextMonth, onPrevMonth } =
    useCalendar();

  return (
    <main className="home">
      <article className="calendar">
        <div className="calendar__action">
          <button onClick={onPrevMonth}>Prev</button>
          <h4>{monthNames[panel.month]}</h4>
          <button onClick={onNextMonth}>Next</button>
        </div>
        <div className="calendar__action">
          <button onClick={onPrevYear}>Prev</button>
          <h4>{panel.year}</h4>
          <button onClick={onNextYear}>Next</button>
        </div>
        <ul className="calendar__days">
          {cells.map((cell, index) => (
            <li key={index} className={cn(cell.type !== "current" && "disabled")}>
              {cell.date}
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}

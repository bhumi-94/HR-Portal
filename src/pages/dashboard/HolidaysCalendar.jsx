import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHolidays } from "../../features/holiday/holidayThunk";

const months = [
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

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HolidayCalendar = () => {
  const dispatch = useDispatch();

  const {
    holidays = [],
    loading,
    error,
  } = useSelector((state) => state.holiday);

  const today = new Date();

  // Current month
  const currentMonth = today.getMonth();

  const currentYear = today.getFullYear();

  // Current month is open by default
  const [openMonth, setOpenMonth] = useState(currentMonth);

  useEffect(() => {
    dispatch(getHolidays());
  }, [dispatch]);

  // GET DAYS IN MONTH
    
  const getDaysInMonth = (month) => {
    return new Date(currentYear, month + 1, 0).getDate();
  };

  // GET FIRST DAY OF MONTH
  // Monday = 0
    
  const getFirstDay = (month) => {
    const day = new Date(currentYear, month, 1).getDay();

    return day === 0 ? 6 : day - 1;
  };

  // CREATE CALENDAR DAYS
    
  const getCalendarDays = (month) => {
    const daysInMonth = getDaysInMonth(month);
    const firstDay = getFirstDay(month);
    const calendarDays = [];

    // Empty spaces before first day
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    // Actual dates
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  // FORMAT DATE
    
  const formatDateKey = (month, day) => {
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    return `${currentYear}-${formattedMonth}-${formattedDay}`;
  };

  // FIND HOLIDAY
    
  const getHoliday = (month, day) => {
    if (!day) return null;
    const dateKey = formatDateKey(month, day);
    return holidays.find((holiday) => {
      const holidayDate = String(holiday.holiday_date).split("T")[0];
      return holidayDate === dateKey;
    });
  };
  
  // HOLIDAY COLORS

  const getHolidayClass = (type) => {
    switch (type) {
      case "national":
        return "bg-[#f3e5d8] text-[#8b5e3c] border-[#d9b99a]";

      case "festival":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "company":
        return "bg-green-50 text-green-700 border-green-200";

      case "optional":
        return "bg-amber-50 text-amber-700 border-amber-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

    
  // TODAY CHECK
    

  const isToday = (month, day) => {
    if (!day) return false;

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

    
  // CALENDAR COMPONENT
    

  const Calendar = ({ month }) => {
    const calendarDays = getCalendarDays(month);

    return (
      <div className="p-4 sm:p-6 md:p-8">
        {/* WEEKDAYS */}

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs"
            >
              {day}
            </div>
          ))}

          {/* DAYS */}

          {calendarDays.map((day, index) => {
            const holiday = getHoliday(month, day);

            return (
              <div
                key={index}
                className="relative min-h-[70px] sm:min-h-[90px] md:min-h-[105px]"
              >
                {day && (
                  <div
                    className={`
                      group relative h-full min-h-[70px]
                      rounded-2xl border p-2
                      transition duration-200
                      sm:min-h-[90px] sm:p-3
                      md:min-h-[105px]

                      ${
                        holiday
                          ? getHolidayClass(holiday.holiday_type)
                          : "border-[#eee7df] bg-white hover:bg-[#fdfcfb]"
                      }

                      ${
                        isToday(month, day)
                          ? "ring-2 ring-[#a27a58] ring-offset-2"
                          : ""
                      }
                    `}
                  >
                    {/* DATE */}

                    <div
                      className={`
                        flex h-7 w-7 items-center justify-center
                        rounded-full text-xs font-semibold
                        sm:h-8 sm:w-8 sm:text-sm

                        ${
                          isToday(month, day)
                            ? "bg-[#a27a58] text-white"
                            : holiday
                              ? "bg-white/70"
                              : "text-gray-700"
                        }
                      `}
                    >
                      {day}
                    </div>

                    {/* HOLIDAY */}

                    {holiday && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />

                        <span className="hidden truncate text-[10px] font-medium sm:block">
                          {holiday.occasion}
                        </span>
                      </div>
                    )}

                    {/* TOOLTIP */}

                    {holiday && (
                      <div
                        className="
                          pointer-events-none
                          absolute bottom-full left-1/2
                          z-50 mb-3 hidden
                          w-52 -translate-x-1/2
                          rounded-2xl
                          border border-[#eee7df]
                          bg-white p-4
                          text-left
                          shadow-xl
                          group-hover:block
                        "
                      >
                        <p className="text-sm font-bold text-[#171717]">
                          {holiday.occasion}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {day} {months[month]} {currentYear}
                        </p>

                        {holiday.description && (
                          <p className="mt-2 text-xs leading-relaxed text-gray-400">
                            {holiday.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      {/* HEADER */}

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#a27a58]">HR Portal ✨</p>

        <h1 className="text-3xl font-bold text-[#171717] md:text-4xl">
          Holidays Calendar
        </h1>

        <p className="mt-2 text-sm text-gray-500 md:text-base">
          View company holidays and important occasions.
        </p>
      </div>

      {/* MAIN CALENDAR */}

      <div className="mx-auto max-w-5xl">
        {/* CURRENT MONTH CALENDAR */}

        <div className="overflow-visible rounded-3xl border border-[#eee7df] bg-white shadow-sm">
          {/* HEADER */}

          <div className="border-b border-[#eee7df] px-5 py-5 sm:px-7">
            <p className="text-sm text-gray-400">Calendar</p>

            <h2 className="mt-1 text-2xl font-bold text-[#171717]">
              {months[openMonth]} {currentYear}
            </h2>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="px-6 py-12 text-center text-gray-500">
              Loading holidays...
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="px-6 py-12 text-center text-red-500">{error}</div>
          )}

          {/* CALENDAR */}

          {!loading && !error && <Calendar month={openMonth} />}
        </div>

        {/* OTHER MONTHS*/}

        <div className="mt-4 space-y-3">
          {months
            .map((month, index) => ({
              month,
              index,
            }))
            .filter(({ index }) => index > currentMonth)
            .map(({ month, index }) => {
              const isOpen = openMonth === index;

              return (
                <div key={month}>
                  {/* MONTH BAR */}

                  <button
                    type="button"
                    onClick={() => setOpenMonth(isOpen ? null : index)}
                    className="
                      flex w-full items-center
                      justify-between
                      rounded-2xl
                      border border-[#eee7df]
                      bg-white
                      px-5 py-4
                      text-left
                      shadow-sm
                      transition
                      hover:border-[#d9b99a]
                      hover:bg-[#fdfcfb]
                      sm:px-7
                    "
                  >
                    <span className="text-sm font-semibold text-[#171717] sm:text-base">
                      {month} {currentYear}
                    </span>

                    <span
                      className={`
                        flex h-8 w-8
                        items-center justify-center
                        rounded-full
                        bg-[#f5eee8]
                        text-[#a27a58]
                        transition-transform duration-300

                        ${isOpen ? "rotate-180" : ""}
                      `}
                    >
                      ↓
                    </span>
                  </button>

                  {/* MONTH CALENDAR */}

                  {isOpen && !loading && !error && (
                    <div className="mt-3 overflow-visible rounded-3xl border border-[#eee7df] bg-white shadow-sm">
                      <div className="border-b border-[#eee7df] px-5 py-5 sm:px-7">
                        <p className="text-sm text-gray-400">Calendar</p>

                        <h2 className="mt-1 text-2xl font-bold text-[#171717]">
                          {month} {currentYear}
                        </h2>
                      </div>

                      <Calendar month={index} />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;

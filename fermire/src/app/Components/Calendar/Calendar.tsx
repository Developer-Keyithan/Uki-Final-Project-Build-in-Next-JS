import React, { useState } from "react";
import { MdNavigateNext } from "react-icons/md";

interface CalendarProps {
    onDateSelect?: (date: Date) => void;
}

const generateCalendarDays = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const daysArray = [];
    const totalSlots = 42;

    // Add previous month's trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        daysArray.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push({ day, isCurrentMonth: true });
    }

    // Add next month's leading days to complete 42 cells
    for (let i = daysArray.length, nextDay = 1; i < totalSlots; i++, nextDay++) {
        daysArray.push({ day: nextDay, isCurrentMonth: false });
    }

    return { daysArray, firstDayOfMonth, daysInMonth };
};

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const { daysArray: days, firstDayOfMonth, daysInMonth } = generateCalendarDays(year, month);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        setMonth(month === 0 ? 11 : month - 1);
        setYear(month === 0 ? year - 1 : year);
    };

    const handleNextMonth = () => {
        setMonth(month === 11 ? 0 : month + 1);
        setYear(month === 11 ? year + 1 : year);
    };

    const handleDateClick = (
        day: number,
        isCurrentMonth: boolean,
        isPrevMonth: boolean,
        isNextMonth: boolean
    ) => {
        let selectedYear = year;
        let selectedMonth = month;

        if (isPrevMonth) {
            selectedMonth = month === 0 ? 11 : month - 1;
            selectedYear = month === 0 ? year - 1 : year;
            setMonth(selectedMonth);
            setYear(selectedYear);
        } else if (isNextMonth) {
            selectedMonth = month === 11 ? 0 : month + 1;
            selectedYear = month === 11 ? year + 1 : year;
            setMonth(selectedMonth);
            setYear(selectedYear);
        }

        const selectedDate = new Date(selectedYear, selectedMonth, day);

        // **Prevent future dates from being selected**
        if (selectedDate > today) {
            return;
        }

        setSelectedDate(day);
        if (onDateSelect) {
            onDateSelect(selectedDate);
        }
    };

    return (
        <div className="bg-white shadow-[0_0_10px_rgb(0,0,0,0.2)] rounded-lg p-6 w-96">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} type="button" className="px-4 py-2 bg-gray-100 hover:bg-primaryColor hover:text-white rounded text-2xl transition ease-in-out duration-300">
                    <MdNavigateNext className="rotate-180" />
                </button>
                <h2 className="text-lg font-semibold">{months[month]} {year}</h2>
                <button onClick={handleNextMonth} type="button" className="px-4 py-2 bg-gray-100 hover:bg-primaryColor hover:text-white rounded text-2xl transition ease-in-out duration-300">
                    <MdNavigateNext />
                </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center font-semibold">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div key={index} className={index === 0 ? "text-red-500" : index === 6 ? "text-orange-500" : ""}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map(({ day, isCurrentMonth }, index) => {
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    const isPrevMonth = index < firstDayOfMonth && !isCurrentMonth;
                    const isNextMonth = index >= firstDayOfMonth + daysInMonth && !isCurrentMonth;

                    const isSelected = selectedDate === day && isCurrentMonth;
                    const dayOfWeek = index % 7; // 0 = Sunday, 6 = Saturday

                    // Check if the day is in the future
                    const isFutureDate = new Date(year, month, day) > today;

                    return (
                        <div
                            key={index}
                            className={`p-2 rounded cursor-pointer
                                ${isFutureDate ? "opacity-50 bg-gray-200 cursor-not-allowed" : isCurrentMonth ? "bg-gray-200 hover:bg-primaryColor hover:text-white" : "bg-gray-200 text-gray-500 opacity-50"}
                                ${isSelected ? "bg-primaryColor text-white transition ease-in-out duration-300" : isToday ? "bg-green-200 text-primaryColor" :  dayOfWeek === 0 ? "text-red-600 bg-red-100" : dayOfWeek === 6 ? "text-orange-600 bg-orange-100" : "" }
                            `}
                            onClick={() => !isFutureDate && handleDateClick(day, isCurrentMonth, isPrevMonth, isNextMonth)}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;

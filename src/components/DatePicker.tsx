import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  isDark?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomDatePicker({
  selected,
  onChange,
  placeholderText = "Select date and time",
  isDark = false,
  error,
  disabled = false,
  className = ""
}: CustomDatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Custom input component to match our design
  const CustomInput = React.forwardRef<HTMLInputElement, any>(
    ({ value, onClick, ...props }, ref) => (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          value={value}
          onClick={onClick}
          readOnly
          className={`w-full px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
            error
              ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-slate-600 focus:ring-cyan-500 focus:border-cyan-500'
          } ${
            disabled
              ? 'bg-gray-100 dark:bg-slate-800 cursor-not-allowed opacity-50'
              : 'bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600'
          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 ${className}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    )
  );

  return (
    <div className="custom-datepicker-wrapper">
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        placeholderText={placeholderText}
        disabled={disabled}
        customInput={<CustomInput ref={inputRef} />}
        className="w-full"
        calendarClassName={`custom-datepicker-calendar ${isDark ? 'dark-theme' : 'light-theme'}`}
        wrapperClassName="w-full"
        popperClassName="custom-datepicker-popper"
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        /* Custom DatePicker Styles */
        .custom-datepicker-wrapper .react-datepicker-wrapper {
          width: 100%;
        }

        .custom-datepicker-wrapper .react-datepicker__input-container {
          width: 100%;
        }

        /* Calendar popup positioning */
        .custom-datepicker-popper {
          z-index: 9999;
        }

        /* Light theme calendar */
        .custom-datepicker-calendar.light-theme .react-datepicker {
          font-family: inherit;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          background-color: #ffffff;
          color: #111827;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__header {
          background-color: #ecfeff;
          border-bottom: 1px solid #d1d5db;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__current-month,
        .custom-datepicker-calendar.light-theme .react-datepicker-time__header {
          color: #0891b2;
          font-weight: 600;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__day-name,
        .custom-datepicker-calendar.light-theme .react-datepicker__day {
          color: #374151;
          border-radius: 0.375rem;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__day:hover {
          background-color: #ecfeff;
          color: #0891b2;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__day--selected,
        .custom-datepicker-calendar.light-theme .react-datepicker__day--keyboard-selected {
          background-color: #0891b2;
          color: #ffffff;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__day--selected:hover {
          background-color: #0e7490;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__day--today {
          background-color: #f3f4f6;
          color: #0891b2;
          font-weight: 600;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__navigation {
          border: none;
          background: none;
          color: #0891b2;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__navigation:hover {
          background-color: #ecfeff;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker__navigation-icon::before {
          border-color: #0891b2;
          border-width: 2px 2px 0 0;
        }

        /* Time picker styles */
        .custom-datepicker-calendar.light-theme .react-datepicker-time__header {
          background-color: #ecfeff;
          color: #0891b2;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker-time__input {
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker-time__input input {
          color: #111827;
        }

        .custom-datepicker-calendar.light-theme .react-datepicker-time__input input:focus {
          border-color: #0891b2;
          box-shadow: 0 0 0 1px #0891b2;
        }

        /* Dark theme calendar */
        .custom-datepicker-calendar.dark-theme .react-datepicker {
          font-family: inherit;
          border: 1px solid #374151;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3);
          background-color: #1f2937;
          color: #f9fafb;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__header {
          background-color: #0f172a;
          border-bottom: 1px solid #374151;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__current-month,
        .custom-datepicker-calendar.dark-theme .react-datepicker-time__header {
          color: #06b6d4;
          font-weight: 600;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__day-name,
        .custom-datepicker-calendar.dark-theme .react-datepicker__day {
          color: #e5e7eb;
          border-radius: 0.375rem;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__day:hover {
          background-color: #0f172a;
          color: #06b6d4;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__day--selected,
        .custom-datepicker-calendar.dark-theme .react-datepicker__day--keyboard-selected {
          background-color: #0891b2;
          color: #ffffff;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__day--selected:hover {
          background-color: #0e7490;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__day--today {
          background-color: #374151;
          color: #06b6d4;
          font-weight: 600;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__navigation {
          border: none;
          background: none;
          color: #06b6d4;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__navigation:hover {
          background-color: #0f172a;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker__navigation-icon::before {
          border-color: #06b6d4;
          border-width: 2px 2px 0 0;
        }

        /* Time picker dark theme styles */
        .custom-datepicker-calendar.dark-theme .react-datepicker-time__header {
          background-color: #0f172a;
          color: #06b6d4;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker-time__input {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.375rem;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker-time__input input {
          color: #f9fafb;
          background-color: #1f2937;
        }

        .custom-datepicker-calendar.dark-theme .react-datepicker-time__input input:focus {
          border-color: #0891b2;
          box-shadow: 0 0 0 1px #0891b2;
        }

        /* Triangle pointer styles */
        .react-datepicker__triangle {
          display: none;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .custom-datepicker-calendar .react-datepicker {
            font-size: 0.875rem;
          }
        }
      `
      }} />
    </div>
  );
}

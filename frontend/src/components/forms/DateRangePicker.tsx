import { useState } from 'react';

interface DateRange {
  start: string;
  end: string;
}

interface DateRangePickerProps {
  onChange: (range: DateRange) => void;
  value?: DateRange;
  label?: string;
}

export function DateRangePicker({ onChange, value, label = 'Date Range' }: DateRangePickerProps) {
  const [start, setStart] = useState(value?.start || '');
  const [end, setEnd] = useState(value?.end || '');

  const handleStartChange = (newStart: string) => {
    setStart(newStart);
    if (newStart && end) {
      onChange({ start: newStart, end });
    }
  };

  const handleEndChange = (newEnd: string) => {
    setEnd(newEnd);
    if (start && newEnd) {
      onChange({ start, end: newEnd });
    }
  };

  const setQuickRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    setStart(startStr);
    setEnd(endStr);
    onChange({ start: startStr, end: endStr });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-900">{label}</label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => handleEndChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setQuickRange(7)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition"
        >
          Last 7 days
        </button>
        <button
          type="button"
          onClick={() => setQuickRange(30)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition"
        >
          Last 30 days
        </button>
        <button
          type="button"
          onClick={() => setQuickRange(90)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition"
        >
          Last 90 days
        </button>
        <button
          type="button"
          onClick={() => setQuickRange(365)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition"
        >
          Last year
        </button>
      </div>

      {start && end && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            Selected period: <span className="font-semibold">{start}</span> to{' '}
            <span className="font-semibold">{end}</span>
          </p>
        </div>
      )}
    </div>
  );
}

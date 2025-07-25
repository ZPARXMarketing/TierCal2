import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CalendarViewProps {
  tasks: any[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export default function CalendarView({ tasks, currentMonth, onMonthChange }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const getNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const getTasksForDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
    return tasks.filter(task => new Date(task.scheduledDate).toDateString() === dateStr);
  };

  const getTaskTypeIndicator = (taskType: string) => {
    switch (taskType) {
      case 'setup': return 'bg-blue-500';
      case 'content': return 'bg-yellow-500';
      case 'engagement': return 'bg-green-500';
      case 'reporting': return 'bg-red-500';
      case 'ads': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const prevMonth = new Date(currentMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthDays = getDaysInMonth(prevMonth);
      const day = prevMonthDays - firstDay + i + 1;
      
      days.push(
        <div key={`prev-${i}`} className="aspect-square p-1 text-center text-gray-400">
          <div className="text-sm">{day}</div>
        </div>
      );
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDate(day);
      const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
      
      days.push(
        <div
          key={`current-${day}`}
          className={`aspect-square p-1 text-center hover:bg-gray-50 rounded cursor-pointer transition-colors ${
            isToday ? 'bg-blue-50 text-blue-600 font-bold' : ''
          }`}
          onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
        >
          <div className="text-sm font-medium">{day}</div>
          {dayTasks.length > 0 && (
            <div className="flex justify-center mt-1 space-x-1">
              {dayTasks.slice(0, 3).map((task, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${getTaskTypeIndicator(task.taskType)}`}
                  title={task.title}
                />
              ))}
              {dayTasks.length > 3 && (
                <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${dayTasks.length - 3} more`} />
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="text-primary mr-2" size={20} />
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={getPreviousMonth}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={getNextMonth}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Setup</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Content</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Engagement</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Reporting</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Ads</span>
            </div>
          </div>

          {/* Selected Date Tasks */}
          {selectedDate && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                Tasks for {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              {getTasksForDate(selectedDate.getDate()).length > 0 ? (
                <ul className="space-y-1">
                  {getTasksForDate(selectedDate.getDate()).map((task, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {task.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No tasks scheduled</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

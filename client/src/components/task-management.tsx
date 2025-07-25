import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CheckSquare, Download, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CalendarView from "@/components/calendar-view";

interface TaskManagementProps {
  project: any;
  selectedTier: number | null;
}

export default function TaskManagement({ project, selectedTier }: TaskManagementProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['/api/projects', project.project.id],
    enabled: !!project.project.id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      const response = await apiRequest("PATCH", `/api/tasks/${taskId}`, { isCompleted });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', project.project.id] });
      toast({
        title: "Task Updated",
        description: "Task completion status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const exportCalendarMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${project.project.id}/export`);
      if (!response.ok) throw new Error('Failed to export calendar');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.project.name}_tasks.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Calendar Exported",
        description: "Your calendar has been downloaded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Export Failed",
        description: "Failed to export calendar. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTaskToggle = (taskId: string, isCompleted: boolean) => {
    updateTaskMutation.mutate({ taskId, isCompleted });
  };

  const handleExportCalendar = () => {
    exportCalendarMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (!projectData) {
    return null;
  }

  const { tasks } = projectData;
  const completedTasks = tasks.filter((task: any) => task.isCompleted).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'setup': return 'task-setup';
      case 'content': return 'task-content';
      case 'engagement': return 'task-engagement';
      case 'reporting': return 'task-reporting';
      case 'ads': return 'task-ads';
      default: return 'task-setup';
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Updated Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
            <Button
              onClick={handleExportCalendar}
              disabled={exportCalendarMutation.isPending}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Download className="mr-2" size={16} />
              {exportCalendarMutation.isPending ? "Exporting..." : "Export Calendar"}
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{totalTasks - completedTasks}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Task Management */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Task List */}
        <Card>
          <CardContent className="p-0">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckSquare className="text-primary mr-2" size={20} />
                Monthly Tasks
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {totalTasks} tasks
                </span>
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {tasks.length > 0 ? (
                tasks.map((task: any) => (
                  <div key={task.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={task.isCompleted}
                        onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(task.scheduledDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {task.description && (
                          <p className={`text-xs mt-1 ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            task.isCompleted ? 'bg-green-100 text-green-800' : getPriorityColor(task.priority)
                          }`}>
                            {task.isCompleted ? 'Completed' : `${task.priority} Priority`}
                          </span>
                          {task.estimatedTime && (
                            <span className="text-xs text-gray-400">{task.estimatedTime}</span>
                          )}
                          <div className={getTaskTypeColor(task.taskType)}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <CheckSquare className="mx-auto text-4xl text-gray-300 mb-4" size={48} />
                  <p className="text-sm">No tasks found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendar View */}
        <CalendarView 
          tasks={tasks}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      </div>
    </div>
  );
}

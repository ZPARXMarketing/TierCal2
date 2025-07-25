import { useState } from "react";
import { Calendar, CheckCircle2, Settings, User } from "lucide-react";
import TierSelection from "@/components/tier-selection";
import TaskManagement from "@/components/task-management";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Calendar className="text-primary text-2xl" />
              <h1 className="text-xl font-semibold text-gray-900">Social Media Task Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <Settings className="text-lg" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <User className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tier Selection */}
        <TierSelection 
          selectedTier={selectedTier}
          onTierSelect={setSelectedTier}
          onProjectCreate={setCurrentProject}
        />

        {/* Task Management - only show when tier is selected */}
        {currentProject && (
          <TaskManagement 
            project={currentProject}
            selectedTier={selectedTier}
          />
        )}

        {/* Monthly Reminder Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="text-primary text-xl mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Client Reminder</h3>
              <p className="text-gray-700 mb-4">
                A reminder will be automatically scheduled at the end of each month to send your client a copy of completed tasks and analytics reports.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="text-primary mr-2" size={16} />
                  <span className="text-sm text-gray-600">
                    Next reminder: <strong>{new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                  </span>
                </div>
                <button className="text-primary hover:text-blue-700 text-sm font-medium transition-colors">
                  Configure Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

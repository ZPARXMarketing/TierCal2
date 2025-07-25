import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Download, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { TIER_DEFINITIONS } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface TierSelectionProps {
  selectedTier: number | null;
  onTierSelect: (tier: number) => void;
  onProjectCreate: (project: any) => void;
}

export default function TierSelection({ selectedTier, onTierSelect, onProjectCreate }: TierSelectionProps) {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectName, setProjectName] = useState("");
  const { toast } = useToast();

  const createProjectMutation = useMutation({
    mutationFn: async (data: { tier: number; startDate: string; name: string }) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (data) => {
      onProjectCreate(data);
      toast({
        title: "Project Created Successfully",
        description: `Generated ${data.tasksCount} tasks for your ${TIER_DEFINITIONS[selectedTier! as keyof typeof TIER_DEFINITIONS].name} tier project.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Project",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTierSelect = (tier: number) => {
    onTierSelect(tier);
  };

  const handleGenerateSchedule = () => {
    if (!selectedTier || !projectName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a tier and enter a project name.",
        variant: "destructive",
      });
      return;
    }

    createProjectMutation.mutate({
      tier: selectedTier,
      startDate,
      name: projectName.trim(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Tier Selection */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Service Tier</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(TIER_DEFINITIONS).map(([tierNum, tier]) => {
            const tierNumber = parseInt(tierNum);
            const isSelected = selectedTier === tierNumber;
            const isPopular = tierNumber === 2;
            
            return (
              <Card 
                key={tierNumber}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTierSelect(tierNumber)}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                    <span className={`text-sm font-medium px-2.5 py-0.5 rounded tier-${tierNumber}-accent`}>
                      Tier {tierNumber}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${tier.price.toLocaleString()}
                    <span className="text-lg font-normal text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="text-green-500 w-4 h-4 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full font-medium ${
                      tierNumber === 1 ? 'bg-primary hover:bg-blue-700' :
                      tierNumber === 2 ? 'bg-orange-500 hover:bg-orange-600' :
                      'bg-purple-600 hover:bg-purple-700'
                    }`}
                    onClick={() => handleTierSelect(tierNumber)}
                  >
                    Select {tier.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Start Date Configuration */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="text-primary mr-2" size={20} />
              Project Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Select Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <CalendarIcon className="inline mr-1" size={14} />
                  All tasks will be automatically scheduled based on your selected start date.
                </p>
              </div>
              <Button 
                onClick={handleGenerateSchedule}
                disabled={createProjectMutation.isPending || !selectedTier}
                className="w-full"
              >
                {createProjectMutation.isPending ? "Generating..." : "Generate Schedule"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Export */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="text-green-500 mr-2" size={20} />
              Calendar Export
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🍎</span>
                <span className="text-2xl">📅</span>
                <span className="text-sm text-gray-600">Compatible with Apple Calendar & Google Calendar</span>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-800">
                  <Download className="inline mr-1" size={14} />
                  Downloads as .ics file format for universal calendar compatibility.
                </p>
              </div>
              <Button 
                variant="secondary"
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={!selectedTier}
              >
                <Download className="mr-2" size={16} />
                Export Calendar (.ics)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="text-orange-500 mr-2" size={20} />
              Monthly Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selected Tier:</span>
                <span className="font-medium text-gray-900">
                  {selectedTier ? TIER_DEFINITIONS[selectedTier as keyof typeof TIER_DEFINITIONS].name : 'Not Selected'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks:</span>
                <span className="font-medium text-gray-900">
                  {selectedTier ? 
                    (selectedTier === 1 ? '6' : selectedTier === 2 ? '15' : '35+') : 
                    '0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed:</span>
                <span className="font-medium text-green-500">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="font-medium text-orange-500">
                  {selectedTier ? 
                    (selectedTier === 1 ? '6' : selectedTier === 2 ? '15' : '35+') : 
                    '0'
                  }
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

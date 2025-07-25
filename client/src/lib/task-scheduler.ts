export interface TaskTemplate {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  taskType: 'setup' | 'content' | 'engagement' | 'reporting' | 'ads';
  recurringDay: number;
}

export const TIER_TASK_TEMPLATES = {
  1: [
    {
      title: "Review/optimize social media profiles",
      description: "Update bios, images for 2 platforms",
      priority: "high" as const,
      estimatedTime: "30 min",
      taskType: "setup" as const,
      recurringDay: 1
    },
    {
      title: "Schedule 2 posts/week",
      description: "Create and schedule content for the week",
      priority: "medium" as const,
      estimatedTime: "45 min",
      taskType: "content" as const,
      recurringDay: 5
    },
    {
      title: "Schedule 2 posts/week",
      description: "Create and schedule content for the week",
      priority: "medium" as const,
      estimatedTime: "45 min",
      taskType: "content" as const,
      recurringDay: 12
    },
    {
      title: "Schedule 2 posts/week",
      description: "Create and schedule content for the week",
      priority: "medium" as const,
      estimatedTime: "45 min",
      taskType: "content" as const,
      recurringDay: 19
    },
    {
      title: "Schedule 2 posts/week",
      description: "Create and schedule content for the week",
      priority: "medium" as const,
      estimatedTime: "45 min",
      taskType: "content" as const,
      recurringDay: 26
    },
    {
      title: "Respond to comments/messages",
      description: "Up to 5 interactions per session",
      priority: "medium" as const,
      estimatedTime: "20 min",
      taskType: "engagement" as const,
      recurringDay: 10
    },
    {
      title: "Respond to comments/messages",
      description: "Up to 5 interactions per session",
      priority: "medium" as const,
      estimatedTime: "20 min",  
      taskType: "engagement" as const,
      recurringDay: 20
    },
    {
      title: "Generate basic analytics report",
      description: "Monthly overview of engagement metrics",
      priority: "high" as const,
      estimatedTime: "60 min",
      taskType: "reporting" as const,
      recurringDay: 30
    }
  ],
  2: [
    // Tier 2 templates would go here - similar structure but more complex
  ],
  3: [
    // Tier 3 templates would go here - most complex
  ]
};

export function generateTasksForMonth(
  tier: number,
  startDate: Date,
  projectId: string
): Array<{
  projectId: string;
  title: string;
  description: string;
  scheduledDate: Date;
  isCompleted: boolean;
  priority: string;
  estimatedTime: string;
  taskType: string;
  tier: number;
  recurringDay: number;
}> {
  const templates = TIER_TASK_TEMPLATES[tier as keyof typeof TIER_TASK_TEMPLATES] || [];
  const tasks = [];
  const year = startDate.getFullYear();
  const month = startDate.getMonth();

  for (const template of templates) {
    tasks.push({
      projectId,
      title: template.title,
      description: template.description,
      scheduledDate: new Date(year, month, template.recurringDay),
      isCompleted: false,
      priority: template.priority,
      estimatedTime: template.estimatedTime,
      taskType: template.taskType,
      tier,
      recurringDay: template.recurringDay
    });
  }

  return tasks;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

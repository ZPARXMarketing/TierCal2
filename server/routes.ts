import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, updateTaskSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create a new project with generated tasks
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      
      // For demo purposes, use a default user ID
      const project = await storage.createProject({
        ...projectData,
        userId: "demo-user"
      });

      // Generate tasks for the project
      const tasks = generateTasksForTier(project.tier, project.startDate, project.id);
      
      // Save all tasks
      for (const taskData of tasks) {
        await storage.createTask(taskData);
      }

      res.json({ project, tasksCount: tasks.length });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Get project with tasks
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const tasks = await storage.getTasksByProject(project.id);
      res.json({ project, tasks });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update task completion
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const updates = updateTaskSchema.parse(req.body);
      const task = await storage.updateTask(req.params.id, updates);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  // Generate calendar export
  app.get("/api/projects/:id/export", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const tasks = await storage.getTasksByProject(project.id);
      const icsContent = generateICSContent(project, tasks);
      
      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', `attachment; filename="${project.name}_tasks.ics"`);
      res.send(icsContent);
    } catch (error) {
      console.error('Error generating calendar export:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateTasksForTier(tier: number, startDate: Date, projectId: string) {
  const tasks = [];
  const start = new Date(startDate);
  
  if (tier === 1) {
    // Tier 1: Basic tasks
    tasks.push({
      projectId,
      title: "Review/optimize social media profiles",
      description: "Update bios, images for 2 platforms",
      scheduledDate: new Date(start.getFullYear(), start.getMonth(), 1),
      isCompleted: false,
      priority: "high",
      estimatedTime: "30 min",
      taskType: "setup",
      tier: 1,
      recurringDay: 1
    });

    // Schedule posts - 2 per week on 5th, 12th, 19th, 26th
    [5, 12, 19, 26].forEach(day => {
      tasks.push({
        projectId,
        title: "Schedule 2 posts/week",
        description: "Create and schedule content for the week",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "45 min",
        taskType: "content",
        tier: 1,
        recurringDay: day
      });
    });

    // Engagement tasks
    [10, 20].forEach(day => {
      tasks.push({
        projectId,
        title: "Respond to comments/messages",
        description: "Up to 5 interactions per session",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "20 min",
        taskType: "engagement", 
        tier: 1,
        recurringDay: day
      });
    });

    // Monthly report
    tasks.push({
      projectId,
      title: "Generate basic analytics report",
      description: "Monthly overview of engagement metrics",
      scheduledDate: new Date(start.getFullYear(), start.getMonth(), 30),
      isCompleted: false,
      priority: "high",
      estimatedTime: "60 min",
      taskType: "reporting",
      tier: 1,
      recurringDay: 30
    });

  } else if (tier === 2) {
    // Tier 2: Standard tasks
    tasks.push({
      projectId,
      title: "Review/optimize profiles on 4 platforms",
      description: "Update bios, images for all platforms",
      scheduledDate: new Date(start.getFullYear(), start.getMonth(), 1),
      isCompleted: false,
      priority: "high",
      estimatedTime: "45 min",
      taskType: "setup",
      tier: 2,
      recurringDay: 1
    });

    // Schedule posts - 4 per week
    [3, 10, 17, 24].forEach(day => {
      tasks.push({
        projectId,
        title: "Schedule 4 posts/week",
        description: "Create and schedule content across platforms",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "60 min",
        taskType: "content",
        tier: 2,
        recurringDay: day
      });
    });

    // Custom graphics
    [7, 14, 21, 28].forEach(day => {
      tasks.push({
        projectId,
        title: "Create custom graphics",
        description: "Design graphics for 8 posts",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "90 min",
        taskType: "content",
        tier: 2,
        recurringDay: day
      });
    });

    // Ad management
    tasks.push({
      projectId,
      title: "Set up ad campaign",
      description: "Configure campaign with $100 budget",
      scheduledDate: new Date(start.getFullYear(), start.getMonth(), 5),
      isCompleted: false,
      priority: "high",
      estimatedTime: "45 min",
      taskType: "ads",
      tier: 2,
      recurringDay: 5
    });

    [15, 25].forEach(day => {
      tasks.push({
        projectId,
        title: "Monitor/adjust ad performance",
        description: "Review and optimize ad targeting",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "30 min",
        taskType: "ads",
        tier: 2,
        recurringDay: day
      });
    });

    // Engagement
    [10, 20, 30].forEach(day => {
      tasks.push({
        projectId,
        title: "Respond to comments/messages",
        description: "Up to 8-9 interactions per session",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "30 min",
        taskType: "engagement",
        tier: 2,
        recurringDay: day
      });
    });

    // Detailed report
    tasks.push({
      projectId,
      title: "Generate detailed analytics report",
      description: "Monthly report with insights and recommendations",
      scheduledDate: new Date(start.getFullYear(), start.getMonth(), 30),
      isCompleted: false,
      priority: "high",
      estimatedTime: "90 min",
      taskType: "reporting",
      tier: 2,
      recurringDay: 30
    });

  } else if (tier === 3) {
    // Tier 3: Premium tasks
    tasks.push({
      projectId,
      title: "Review/optimize profiles on 6 platforms",
      description: "Update bios, images for all major platforms",
      scheduledDate: new Date(start.getFullYear(), start.getMonth(), 1),
      isCompleted: false,
      priority: "high",
      estimatedTime: "60 min",
      taskType: "setup",
      tier: 3,
      recurringDay: 1
    });

    // Daily posts - 30 posts/month
    for (let day = 2; day <= 31; day++) {
      if (day <= getDaysInMonth(start.getFullYear(), start.getMonth())) {
        tasks.push({
          projectId,
          title: "Schedule daily posts",
          description: "1-2 posts per day across platforms",
          scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
          isCompleted: false,
          priority: "medium",
          estimatedTime: "30 min",
          taskType: "content",
          tier: 3,
          recurringDay: day
        });
      }
    }

    // Advanced content creation
    [5, 12, 19, 26].forEach(day => {
      tasks.push({
        projectId,
        title: "Create custom graphics/videos",
        description: "Advanced content for 22-23 posts",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "high",
        estimatedTime: "120 min",
        taskType: "content",
        tier: 3,
        recurringDay: day
      });
    });

    // Advanced ad management
    tasks.push({
      projectId,
      title: "Set up advanced ad campaign",
      description: "Configure campaign with $300 budget",
      scheduledDate: new Date(start.getFullYear(), start.getMonth(), 5),
      isCompleted: false,
      priority: "high",
      estimatedTime: "60 min",
      taskType: "ads",
      tier: 3,
      recurringDay: 5
    });

    [10, 20, 30].forEach(day => {
      tasks.push({
        projectId,
        title: "Optimize ad targeting/performance",
        description: "Advanced targeting and performance optimization",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "45 min",
        taskType: "ads",
        tier: 3,
        recurringDay: day
      });
    });

    // Influencer coordination
    [7, 21].forEach(day => {
      tasks.push({
        projectId,
        title: "Coordinate with micro-influencers",
        description: "Content planning and approvals with 1-2 influencers",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "60 min",
        taskType: "content",
        tier: 3,
        recurringDay: day
      });
    });

    // SEO optimization
    [3, 17].forEach(day => {
      tasks.push({
        projectId,
        title: "Research/update SEO-optimized hashtags",
        description: "Update hashtags and keywords for each platform",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "low",
        estimatedTime: "45 min",
        taskType: "content",
        tier: 3,
        recurringDay: day
      });
    });

    // Weekly engagement
    [7, 14, 21, 28].forEach(day => {
      tasks.push({
        projectId,
        title: "Respond to comments/messages",
        description: "Unlimited interactions within reason",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "medium",
        estimatedTime: "45 min",
        taskType: "engagement",
        tier: 3,
        recurringDay: day
      });
    });

    // Weekly analytics
    [7, 14, 21, 28].forEach(day => {
      tasks.push({
        projectId,
        title: "Generate weekly analytics report",
        description: "Detailed performance tracking with strategy adjustments",
        scheduledDate: new Date(start.getFullYear(), start.getMonth(), day),
        isCompleted: false,
        priority: "high",
        estimatedTime: "60 min",
        taskType: "reporting",
        tier: 3,
        recurringDay: day
      });
    });
  }

  return tasks;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function generateICSContent(project: any, tasks: any[]): string {
  const now = new Date();
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Social Media Task Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  tasks.forEach((task, index) => {
    const startDate = new Date(task.scheduledDate);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    ics.push(
      'BEGIN:VEVENT',
      `UID:task-${task.id || index}@socialmedia-taskmanager.com`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${task.title}`,
      `DESCRIPTION:${task.description || ''}`,
      `PRIORITY:${task.priority === 'high' ? '1' : task.priority === 'medium' ? '5' : '9'}`,
      'END:VEVENT'
    );
  });

  // Add monthly reminder
  const monthEnd = new Date(project.startDate.getFullYear(), project.startDate.getMonth() + 1, 0);
  ics.push(
    'BEGIN:VEVENT',
    `UID:reminder-${project.id}@socialmedia-taskmanager.com`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(monthEnd)}`,
    `DTEND:${formatDate(new Date(monthEnd.getTime() + 60 * 60 * 1000))}`,
    'SUMMARY:Send client completion report',
    'DESCRIPTION:Send client a copy of completed tasks and analytics reports',
    'PRIORITY:1',
    'END:VEVENT'
  );

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

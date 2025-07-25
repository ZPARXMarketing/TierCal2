export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  priority?: 'high' | 'medium' | 'low';
}

export function generateICS(events: CalendarEvent[], projectName: string): string {
  const now = new Date();
  
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatPriority = (priority?: string): string => {
    switch (priority) {
      case 'high': return '1';
      case 'medium': return '5';
      case 'low': return '9';
      default: return '5';
    }
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Social Media Task Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${projectName} Tasks`,
    'X-WR-CALDESC:Social Media Marketing Tasks'
  ];

  events.forEach((event) => {
    ics.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@socialmedia-taskmanager.com`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(event.startDate)}`,
      `DTEND:${formatDate(event.endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `PRIORITY:${formatPriority(event.priority)}`,
      'STATUS:TENTATIVE',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

export function downloadICS(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

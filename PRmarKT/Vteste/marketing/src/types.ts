export type Role = 'manager' | 'member';

export interface TeamMember {
  id: string;
  name: string;
  role: string; // e.g., "SMM Specialist", "Graphic Designer", "Copywriter", "SEO Specialist"
  avatarCode: string; // Initial letters or color theme
  color: string; // Tailwind color class
  username: string; // e.g., "@anna_smm"
}

export interface AttachedFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string; // File URL (objectURL or base64) for realistic download/preview
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // TeamMember IDs, or ["all"] for everyone
  deadline: string; // ISO date string
  reminderType: 'classic' | 'custom' | 'none';
  customReminderHours?: number[]; // list of times in hours (e.g., [1, 6, 24]) to remind
  reminders?: { time: string; sent: boolean }[]; // Specific date/time reminders
  createdAt: string; // ISO date string
  attachedFiles: AttachedFile[];
  
  // Status tracking: key is team member's ID, value is detail of completeness
  completions: {
    [memberId: string]: {
      completed: boolean;
      status: 'pending' | 'in-progress' | 'done' | 'cancelled';
      completedAt?: string; // ISO date string
      comment?: string;
      completedFile?: AttachedFile; // user attached report file
    };
  };
}

export interface BroadCastNotification {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'reminder' | 'urgent';
  createdAt: string;
  targetMemberIds: string[]; // list of member IDs or ['all']
  buttons?: Array<{ label: string; url?: string; actionId?: string }>; // action buttons for the broadcast
}

export interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isForm?: 'complete' | '15min' | null;
  formTaskId?: string;
  inlineButtons?: Array<{
    label: string;
    action: string;
    payload?: any;
  }>;
}

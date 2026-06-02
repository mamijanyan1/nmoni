import { TeamMember, Task, BroadCastNotification } from './types';

export const teamMembers: TeamMember[] = [
  {
    id: 'anna',
    name: 'Анечка SMM',
    role: 'SMM-королева ✨',
    avatarCode: '🙋‍♀️',
    color: 'bg-rose-100 text-rose-600 border-rose-200/50',
    username: '@anna_smm'
  },
  {
    id: 'pavel',
    name: 'Паша Текст',
    role: 'Копирайтер ✍️',
    avatarCode: '📝',
    color: 'bg-amber-100 text-amber-700 border-amber-200/50',
    username: '@pavel_write'
  },
  {
    id: 'max',
    name: 'Макс Дизайн',
    role: 'Креатор 🎨',
    avatarCode: '🎨',
    color: 'bg-purple-100 text-purple-700 border-purple-200/50',
    username: '@max_design'
  },
  {
    id: 'kate',
    name: 'Катя Трафик',
    role: 'Таргетолог 🚀',
    avatarCode: '💅',
    color: 'bg-teal-100 text-teal-700 border-teal-200/50',
    username: '@kate_ads'
  }
];

// Helpers for date calculations
const getFutureDate = (days: number, hours: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

const getPastDate = (hoursAgo: number) => {
  const d = new Date();
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Подготовить летние креативы 🌸',
    description: 'Сделать 3 баннера к распродаже.',
    assignedTo: ['max', 'anna'],
    deadline: getFutureDate(0, 4), // 4 hours from now
    reminderType: 'classic', 
    createdAt: getPastDate(10),
    attachedFiles: [
      {
        name: 'Брендбук_Лето.pdf',
        size: 345000,
        type: 'application/pdf',
        dataUrl: '#'
      }
    ],
    completions: {
      'max': {
        completed: true,
        status: 'done',
        completedAt: getPastDate(1),
        comment: 'Готово в Figma! Цвета огонь 🥐',
        completedFile: {
          name: 'креативы_final.zip',
          size: 4700000,
          type: 'application/zip',
          dataUrl: '#'
        }
      },
      'anna': {
        completed: false,
        status: 'pending'
      }
    }
  },
  {
    id: 'task-2',
    title: 'Написать прогрев для Telegram 📝',
    description: 'Написать 4 текста к запуску коллекции.',
    assignedTo: ['pavel'],
    deadline: getFutureDate(1, 2),
    reminderType: 'custom',
    customReminderHours: [1, 6],
    createdAt: getPastDate(4),
    attachedFiles: [],
    completions: {
      'pavel': {
        completed: false,
        status: 'pending'
      }
    }
  },
  {
    id: 'task-3',
    title: 'Аудит UTM-меток по блогерам 📊',
    description: 'Проверить метки Карины и Даши.',
    assignedTo: ['kate'],
    deadline: getFutureDate(-0.5), // already past deadline for demo!
    reminderType: 'none',
    createdAt: getPastDate(20),
    attachedFiles: [],
    completions: {
      'kate': {
        completed: false,
        status: 'pending'
      }
    }
  }
];

export const initialBroadcasts: BroadCastNotification[] = [
  {
    id: 'broad-1',
    title: 'Планерка ☕',
    message: 'Созвон по итогам недели сегодня в 12:00 в Telegram.',
    type: 'general',
    createdAt: getPastDate(3),
    targetMemberIds: ['all'],
    buttons: [
      { label: '🔗 Войти в Zoom', url: 'https://zoom.us' }
    ]
  }
];

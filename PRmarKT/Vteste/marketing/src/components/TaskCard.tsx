import React, { useState } from 'react';
import { Task, TeamMember } from '../types';
import { Clock, Trash2, Bell, Paperclip, Download, Send, Check, AlertTriangle, MessageCircleHeart } from 'lucide-react';

interface TaskCardProps {
  key?: string | number;
  task: Task;
  teamMembers: TeamMember[];
  onUndo: (taskId: string, memberId: string) => void;
  onDelete: (taskId: string) => void;
  onSendManualReminder: (taskId: string, targetMemberId: string, text: string) => void;
  onUpdateDeadline: (taskId: string, newDeadlineStr: string) => void;
  onReactivate: (taskId: string) => void;
  onSandboxPreview?: (title: string, desc: string, img?: string) => void;
}

export default function TaskCard({
  task,
  teamMembers,
  onUndo,
  onDelete,
  onSendManualReminder,
  onUpdateDeadline,
  onReactivate,
  onSandboxPreview
}: TaskCardProps) {
  const [activeNudgeId, setActiveNudgeId] = useState<string | null>(null);
  const [customNudgeText, setCustomNudgeText] = useState('🌟 Հիշեցում: Բարև, ինչպե՞ս է ընթանում գործը: Պատրաստ լինելիս կարող ես ուղարկել 🥰');
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [tempDeadline, setTempDeadline] = useState(() => {
    // Keep raw local date format or default
    try {
      const dateLocal = new Date(task.deadline);
      const tzOffset = dateLocal.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(dateLocal.getTime() - tzOffset)).toISOString().slice(0, 16);
      return localISOTime;
    } catch (e) {
      return task.deadline.substring(0, 16);
    }
  });

  const getMemberById = (id: string): TeamMember | undefined => {
    return teamMembers.find(m => m.id === id);
  };

  const assignees: TeamMember[] = task.assignedTo.includes('all')
    ? teamMembers
    : (task.assignedTo.map(id => getMemberById(id)).filter(Boolean) as TeamMember[]);

  const isOverdue = new Date(task.deadline).getTime() < Date.now();

  // Format deadline beautifully
  const formattedDeadline = new Date(task.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const sendNudge = (memberId: string) => {
    if (!customNudgeText.trim()) return;
    onSendManualReminder(task.id, memberId, customNudgeText.trim());
    setActiveNudgeId(null);
  };

  return (
    <div className="bg-white hover:border-zinc-300 border border-zinc-100 rounded-2xl p-6 text-left shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-200 flex flex-col justify-between space-y-4">
      
      <div>
        {/* Badges & Actions header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider ${
              isOverdue 
                ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                : 'bg-zinc-100 text-zinc-650 border border-zinc-200/40'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Due {formattedDeadline}</span>
            </span>

            {isOverdue && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 uppercase tracking-wide animate-pulse">
                <span>🔥 Overdue</span>
              </span>
            )}

            {(isOverdue || task.assignedTo.every(id => task.completions[id]?.completed)) && (
              <button
                onClick={() => onReactivate(task.id)}
                className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-2 py-1 rounded-md border border-emerald-100 cursor-pointer transition-colors"
                title="Move back to active"
              >
                <span>🚀 Re-activate</span>
              </button>
            )}

            <button
              onClick={() => setIsEditingDeadline(!isEditingDeadline)}
              className="text-[10px] text-zinc-400 hover:text-zinc-950 hover:underline font-semibold font-mono flex items-center gap-1 cursor-pointer select-none"
              title="Change deadline"
            >
              ✏️ Change Deadline
            </button>

            {onSandboxPreview && (
              <button
                onClick={() => onSandboxPreview(task.title, task.description, task.attachedFiles?.[0]?.dataUrl)}
                className="text-[10px] text-pink-600 hover:text-pink-800 hover:underline font-bold font-mono flex items-center gap-1 cursor-pointer select-none"
                title="Preview inside Live SMM phone mockup sandbox"
              >
                📱 View Mockup
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (confirm('Delete this task? It will disappear from the Telegram bot for all assigned employees.')) {
                onDelete(task.id);
              }
            }}
            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-zinc-50 rounded-lg transition-all cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Inline Deadline Editor */}
        {isEditingDeadline && (
          <div className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-xl space-y-2 mt-2 mb-3.5 font-sans animate-in slide-in-from-top-1 duration-155">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider font-mono">📅 Assign New Deadline</span>
              <button 
                onClick={() => setIsEditingDeadline(false)} 
                className="text-[10px] text-zinc-400 hover:text-zinc-650 font-bold"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={tempDeadline}
                onChange={e => setTempDeadline(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-900 cursor-pointer font-medium font-mono focus:outline-hidden flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (!tempDeadline) return;
                  onUpdateDeadline(task.id, new Date(tempDeadline).toISOString());
                  setIsEditingDeadline(false);
                }}
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Title */}
        <h4 className="font-semibold text-zinc-900 text-base leading-snug mb-2">
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-zinc-500 text-[13px] leading-relaxed mb-4">
          {task.description}
        </p>

        {/* Attached Briefs */}
        {task.attachedFiles && task.attachedFiles.length > 0 && (
          <div className="mb-4 pt-3 border-t border-zinc-100">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-zinc-400" />
              <span>Materials / Brief</span>
            </p>
            <div className="space-y-1.5 font-mono">
              {task.attachedFiles.map((f, fidx) => (
                <a
                  key={fidx}
                  href={f.dataUrl}
                  download={f.name}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-100/80 hover:border-zinc-200 text-[11px] text-zinc-700 transition-all text-left group"
                >
                  <span className="truncate max-w-[85%] font-medium">{f.name}</span>
                  <Download className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Auto Reminders Status */}
        <div className="bg-zinc-50/50 px-3 py-2 rounded-xl border border-zinc-100 text-[11px] text-zinc-500 flex items-center gap-2 mb-4 font-mono">
          <Bell className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="font-medium text-[10.5px]">
            {task.reminderType === 'classic' && '🔔 Auto-reminder in bot 2 hours before'}
            {task.reminderType === 'none' && '🔕 No auto-reminders'}
            {task.reminderType === 'custom' && `🚨 Custom series in bot at: ${task.customReminderHours?.map(h => `${h}h`).join(', ')}`}
          </span>
        </div>

        {/* Progress Tracker for Assignees */}
        <div className="space-y-2.5 pt-3 border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Assignees & Status:</p>
          
          {assignees.map(m => {
            const row = task.completions[m.id];
            const isDone = row && row.completed;
            const isNudging = activeNudgeId === m.id;

            return (
              <div key={m.id} className="bg-zinc-50/20 border border-zinc-100 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-300" />
                    <span className="font-bold text-zinc-800">{m.name}</span>
                    <span className="text-[10px] text-zinc-450 font-medium">({m.role})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDone ? (
                      <span className="text-emerald-700 font-bold text-[10px] items-center flex gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-mono uppercase">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Submitted</span>
                      </span>
                    ) : (
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border tracking-wider font-mono uppercase ${
                        isOverdue 
                          ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse' 
                          : 'bg-zinc-100 border-zinc-200/50 text-zinc-650'
                      }`}>
                        {isOverdue ? 'Overdue' : 'In Progress'}
                      </span>
                    )}

                    <button
                      onClick={() => onSendManualReminder(task.id, m.id, '🔔 ՀԻՇԵՑՈՒՄ: Խնդրում եմ հնարավորինս շուտ ավարտել այս գործը! ❤️')}
                      className="text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md ml-2 cursor-pointer transition-colors"
                      title="Direct prompt"
                    >
                      ⚡ Instant Prompt
                    </button>

                    {!isDone && (
                      <button
                        onClick={() => {
                          if (isNudging) {
                            setActiveNudgeId(null);
                          } else {
                            setActiveNudgeId(m.id);
                          }
                        }}
                        className="text-[11px] text-zinc-500 hover:text-zinc-900 font-semibold ml-1 cursor-pointer flex items-center gap-0.5 transition-all select-none"
                      >
                        <Bell className="w-3 h-3" />
                        <span>Prompt</span>
                      </button>
                    )}

                    {isDone && (
                      <button
                        onClick={() => onUndo(task.id, m.id)}
                        className="text-[10.5px] text-zinc-500 hover:text-rose-600 hover:underline font-bold ml-1 cursor-pointer transition-colors"
                        title="Return to working status"
                      >
                        ↩️ Return to Work
                      </button>
                    )}
                  </div>
                </div>

                {/* Submissions feedback */}
                {isDone && (row.comment || row.completedFile) && (
                  <div className="pl-3 border-l border-zinc-200 text-xs text-zinc-650 space-y-1 mt-1 bg-white/40 p-2.5 rounded-r-lg">
                    {row.comment && <p className="italic text-zinc-500">« {row.comment} »</p>}
                    {row.completedFile && (
                      <div className="flex items-center gap-1.5 text-zinc-800 text-[11px] font-bold mt-1">
                        <Paperclip className="w-3 h-3 text-zinc-400" />
                        <span className="text-zinc-400 font-normal">Report File:</span>
                        <a href={row.completedFile.dataUrl} download={row.completedFile.name} className="underline hover:text-rose-600 flex items-center gap-0.5 font-mono text-[10.5px]">
                          {row.completedFile.name}
                          <Download className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Inline manual nudge form dialog */}
                {isNudging && (
                  <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-zinc-200 space-y-2.5 animate-in slide-in-from-top-1 duration-150 text-left shadow-xs">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase font-bold font-mono">
                      <span>💬 Custom Reminder Message for TG Bot</span>
                      <button onClick={() => setActiveNudgeId(null)} className="text-zinc-400 font-bold hover:underline">Close</button>
                    </div>
                    <textarea
                      value={customNudgeText}
                      onChange={e => setCustomNudgeText(e.target.value)}
                      className="w-full text-xs p-2.5 border border-zinc-200 rounded-xl bg-zinc-50/20 text-zinc-800 focus:outline-hidden h-14 resize-none leading-relaxed"
                    />

                    {/* Pre-made reminder templates */}
                    <div className="flex gap-1.5 flex-wrap">
                      <button 
                        type="button" 
                        onClick={() => setCustomNudgeText('⚠️ Հիշեցում: Ժամանակը քիչ է, սպասում եմ առաջադրանքիդ ❤️')}
                        className="text-[9.5px] bg-zinc-100 px-2.5 py-1 rounded-lg hover:bg-zinc-200/50 text-zinc-650 font-semibold"
                      >
                        🔥 Burning Deadline
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCustomNudgeText('🌟 Հիշեցում: Բարև, ինչպե՞ս է ընթանում գործը: Պատրաստ լինելիս կարող ես ուղարկել 🥰')}
                        className="text-[9.5px] bg-zinc-100 px-2.5 py-1 rounded-lg hover:bg-zinc-200/50 text-zinc-650 font-semibold"
                      >
                        🌸 Soft Reminder
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => sendNudge(m.id)}
                      className="w-full flex items-center justify-center space-x-1 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Push Notification to @{m.name.toLowerCase()}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Task, TeamMember, AttachedFile } from '../types';
import { X, Paperclip, Check, Bell, Calendar } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completions'>) => void;
  teamMembers: TeamMember[];
  prefilledDescription?: string;
  prefilledTitle?: string;
  prefilledFiles?: AttachedFile[];
}

export default function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  teamMembers,
  prefilledDescription = '',
  prefilledTitle = '',
  prefilledFiles = []
}: CreateTaskModalProps) {
  const [title, setTitle] = useState(prefilledTitle);
  const [description, setDescription] = useState(prefilledDescription);
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>(prefilledFiles);
  const [error, setError] = useState('');
  
  const [deadline, setDeadline] = useState(() => {
    // Default to tomorrow 18:00
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().substring(0, 16);
  });

  // Reminder type state
  const [reminderType, setReminderType] = useState<'classic' | 'custom' | 'none'>('classic');
  // Selected time options for custom reminders
  const [customReminders, setCustomReminders] = useState<string[]>([]);

  if (!isOpen) return null;

  const addReminder = () => {
    if (customReminders.length < 10) {
      setCustomReminders([...customReminders, '']);
    }
  };

  const removeReminder = (index: number) => {
    setCustomReminders(customReminders.filter((_, i) => i !== index));
  };

  const updateReminder = (index: number, value: string) => {
    const newReminders = [...customReminders];
    newReminders[index] = value;
    setCustomReminders(newReminders);
  };

  const handleToggleAssignee = (id: string) => {
    if (id === 'all') {
      if (assignedTo.includes('all')) {
        setAssignedTo([]);
      } else {
        setAssignedTo(['all']);
      }
    } else {
      let next = assignedTo.filter(item => item !== 'all');
      if (next.includes(id)) {
        next = next.filter(item => item !== id);
      } else {
        next.push(id);
      }
      setAssignedTo(next);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    filesArray.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: AttachedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string || '#'
        };
        setAttachedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || assignedTo.length === 0) {
      setError('Please enter a title, description, and assign at least one team member!');
      return;
    }
    setError('');

    onSave({
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo.includes('all') ? teamMembers.map(t => t.id) : assignedTo,
      deadline: new Date(deadline).toISOString(),
      reminderType,
      reminders: reminderType === 'custom' 
        ? customReminders.filter(r => r !== '').map(time => ({ time: new Date(time).toISOString(), sent: false }))
        : undefined,
      attachedFiles
    });

    onClose();
  };

  const removeAttachedFile = (idx: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div id="create-task-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs">
      <div className="bg-white border border-zinc-200 rounded-xl w-full max-w-lg p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150 overflow-y-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4 font-sans">
          <div className="flex items-center space-x-2">
            <span className="text-xs">✨</span>
            <h3 className="font-bold text-xs text-zinc-900">New Task</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 text-zinc-400 hover:text-zinc-950 rounded-lg hover:bg-zinc-50 transition-all cursor-pointer animate-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-3.5">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center gap-1.5 font-sans">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          {/* TITLE & DESC */}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider font-mono">Title</label>
            <input
              type="text"
              placeholder="e.g. Create 3 Instagram Stories about summer sales"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 font-medium font-sans"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider font-mono">Brief / Description</label>
            <textarea
              placeholder="Write details or attach brief..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 h-16 resize-none leading-relaxed font-sans"
              required
            />
          </div>

          {/* ASSIGNMENTS */}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block font-mono">Assignee</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-sans">
              <button
                type="button"
                onClick={() => handleToggleAssignee('all')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs text-left transition-all cursor-pointer ${
                  assignedTo.includes('all')
                    ? 'bg-zinc-950 border-zinc-950 text-white font-medium shadow-xs'
                    : 'bg-zinc-50/50 border-zinc-200/85 text-zinc-650 hover:border-zinc-350 hover:bg-zinc-50'
                }`}
              >
                <span>🌍 All Team</span>
                {assignedTo.includes('all') && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {teamMembers.map(m => {
                const isSelected = assignedTo.includes(m.id) || assignedTo.includes('all');
                return (
                   <button
                    key={m.id}
                    type="button"
                    disabled={assignedTo.includes('all')}
                    onClick={() => handleToggleAssignee(m.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white font-medium shadow-xs'
                        : 'bg-zinc-50/50 border-zinc-200/85 text-zinc-650 hover:border-zinc-350 hover:bg-zinc-50'
                    } ${assignedTo.includes('all') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="truncate">{m.name.split(' ')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DEADLINE & ATTACH FILE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-sans">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Deadline</span>
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 cursor-pointer font-medium font-mono outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider flex items-center gap-1 font-mono">
                <Paperclip className="w-3.5 h-3.5 text-zinc-500" />
                <span>Attachment / Brief File</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="task-file-input"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="task-file-input"
                  className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-zinc-50 border border-zinc-200 hover:border-zinc-350 h-[38px] rounded-xl text-xs text-zinc-500 hover:text-zinc-900 cursor-pointer transition-all font-semibold text-center border-dashed"
                >
                  <Paperclip className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Select file...</span>
                </label>
              </div>
            </div>
          </div>

          {/* ATTACHED FILES VIEW */}
          {attachedFiles.length > 0 && (
            <div className="p-2 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-1 max-h-24 overflow-y-auto font-sans">
              <p className="text-[9px] uppercase font-bold tracking-wider text-zinc-400 font-mono">Files ({attachedFiles.length})</p>
              {attachedFiles.map((f, fidx) => (
                <div key={fidx} className="flex items-center justify-between text-xs py-1 px-2 bg-white border border-zinc-200 rounded-lg">
                  <span className="truncate max-w-[80%] text-zinc-650 font-mono text-[10px]">{f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(fidx)}
                    className="text-[10px] text-zinc-500 hover:text-red-500 font-medium cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* REMINDER LOGIC */}
          <div className="bg-zinc-50/50 p-3 rounded-xl border border-zinc-200/60 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1 font-mono">
                <Bell className="w-3.5 h-3.5 text-zinc-500" />
                <span>TG Reminders</span>
              </label>

              <div className="flex bg-zinc-100 border border-zinc-200 rounded-lg p-0.5 text-[9px] font-sans">
                <button
                  type="button"
                  onClick={() => setReminderType('classic')}
                  className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                    reminderType === 'classic' ? 'bg-zinc-900 text-white font-medium shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  2 Hours Before
                </button>
                <button
                  type="button"
                  onClick={() => setReminderType('custom')}
                  className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                    reminderType === 'custom' ? 'bg-zinc-900 text-white font-medium shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Custom
                </button>
                <button
                  type="button"
                  onClick={() => setReminderType('none')}
                  className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                    reminderType === 'none' ? 'bg-zinc-900 text-white font-medium shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  No Pushes
                </button>
              </div>
            </div>

            {reminderType === 'classic' && (
              <p className="text-[10.5px] text-zinc-500 leading-normal font-mono">
                🤖 Bot will send a friendly reminder 2 hours before the deadline.
              </p>
            )}

            {reminderType === 'none' && (
              <p className="text-[10.5px] text-zinc-500 leading-normal font-mono">
                🔕 No automatic notifications. You can prompt manually.
              </p>
            )}

            {reminderType === 'custom' && (
              <div className="space-y-1.5 animate-in fade-in duration-100 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] text-zinc-400 font-bold font-mono">Specific reminder time ({customReminders.length}/10):</p>
                  {customReminders.length < 10 && (
                    <button type="button" onClick={addReminder} className="text-[9px] text-zinc-600 hover:text-zinc-900 font-bold underline">
                      + Add
                    </button>
                  )}
                </div>
                
                {customReminders.map((reminder, index) => (
                  <div key={index} className="flex gap-1">
                    <input
                      type="datetime-local"
                      value={reminder}
                      onChange={e => updateReminder(index, e.target.value)}
                      className="flex-1 text-xs px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900"
                    />
                    <button type="button" onClick={() => removeReminder(index)} className="px-2 text-zinc-400 hover:text-red-500">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-1.5 pt-3 border-t border-zinc-100 font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-550 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer select-none active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
            >
              Create Task 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
